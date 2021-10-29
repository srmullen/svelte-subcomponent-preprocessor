const fs = require('fs-extra');
const path = require('path');

const out = './node_modules/.svelte-subcomponent-preprocessor/';

module.exports = function nestedComponentsPreprocesser() {
  const fileDependencies = {};

  return {
    markup: async ({ content, filename }) => {
      const fullRE = /{#component\s+([A-Za-z]+[0-9]*)\s*}([\s\S]*?){\/component}/;
      const fullREg = /{#component\s+([A-Za-z]+[0-9]*)\s*}([\s\S]*?){\/component}/g;
      let code = content;
      let matches = code.match(fullREg);
      if (matches) {
        const deps = [];
        const files = [];
        for (let i = 0; i < matches.length; i++) {
          const match = code.match(fullRE);
          code = code.substr(0, match.index) + code.substr(match.index + match[0].length);

          const filedir = path.relative('.', path.parse(filename).dir);
          const filelocation = path.join(out, filedir);
          const componentName = match[1];
          const componentSrc = match[2];
          const location = path.join(filelocation, componentName + '.svelte');
          deps.push({
            location,
            name: componentName
          });
          files.push(fs.outputFile(location, componentSrc, 'utf-8'));
        }
        await Promise.all(files);
        fileDependencies[filename] = deps;

        // Check that the component has a script tag. If not insert one. Otherwise the script preprocess wont get called.
        return {
          code,
          dependencies: deps.map(({ location }) => path.resolve(location))
        };
      }
    },
    script: ({ content, filename, attributes }) => {
      if (attributes.context !== 'module') {
        const deps = fileDependencies[filename];
        if (!deps) {
          return;
        }

        let imports = '';
        deps.forEach(({ location, name }) => {
          const imprt = `import ${name} from '${path.relative(path.parse(filename).dir, location)}'\n`;
          imports += imprt;
        });
        const newContent = imports + content;
        return {
          code: newContent
        };
      }
    }
  }
}