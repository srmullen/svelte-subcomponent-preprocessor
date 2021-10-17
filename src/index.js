const fs = require('fs-extra');
const path = require('path');
const { parse, walk } = require('svelte/compiler');

const componentIdentifier = 'Component';
const out = './node_modules/.nestedComponentPreprocesser';

function remove(content, start, end) {
  return content.substr(0, start) + content.substr(end);
}

function stripComponentTag(code) {
  let componentSrc = '';
  const start = code.indexOf('>');
  componentSrc = code.substr(start + 1);
  const end = componentSrc.indexOf(`</${componentIdentifier}`);
  return componentSrc.substr(0, end);
}

module.exports = function nestedComponentsPreprocesser() {
  const fileDependencies = {};

	return {
		markup: async ({ content, filename }) => {
      const components = [];
      const ast = parse(content);
      
      // Find the location of components to turn into subcomponents
      walk(ast, {
        enter(node, parent, key, index) {
          if (node.type === "InlineComponent" && node.name === componentIdentifier) {
            const nameAttr = node.attributes.find(attr => attr.name === 'name');
            components.push({
              start: node.start,
              end: node.end,
              name: nameAttr.value[0].raw
            });
          }
        }
      });

      if (components.length) {
        const dependencies = [];

        const filedir = path.parse(filename).dir;
        const filelocation = path.join(out, filedir);

        // Read the components out of the content and write them to disk
        // Add the location on disk to the dependencies array
        await Promise.all(components.map(component => {
          const code = content.substr(component.start, component.end - component.start);
          const componentSrc = stripComponentTag(code);
          const location = path.join(filelocation, component.name + '.svelte');
          dependencies.push({
            location,
            name: component.name
          });
          return fs.outputFile(location, componentSrc, 'utf-8');
        }));

        // Sort the components by last in the code
        components.sort((a, b) => {
          if (b.start > a.start) {
            return 1;
          } else if (b.start < a.start) {
            return -1;
          } else {
            return 0;
          }
        });

        let newContent = content;
        components.forEach(component => {
          newContent = remove(newContent, component.start, component.end);
        });

        // Make the dependencies available to the script.
        fileDependencies[filename] = dependencies;

        return {
          code: newContent,
          dependencies: dependencies.map(dep => dep.location)
        };
      }
		},
    script: ({ content, filename }) => {
      const dependencies = fileDependencies[filename];

      if (dependencies) {
        let dependenciesStr = '';
        for (let i = 0; i < dependencies.length; i++) {
          const dependency = dependencies[i];
          const parsedPath = path.parse(filename)
          const importDir = path.relative(parsedPath.dir, dependency.location);
          dependenciesStr += `import ${dependency.name} from '${importDir}'\n`;
        }

        const newContent = dependenciesStr + content;

        return {
          code: newContent
        };
      }
    }
	}
}