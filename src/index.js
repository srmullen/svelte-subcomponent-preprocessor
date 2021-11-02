const fs = require('fs-extra');
const path = require('path');
const { stripComments, hasScriptTag } = require('./util');
const { componentsRE, scriptRE, contextAttrRE } = require('./regexp');

const DEFAULT_OUT = './node_modules/.svelte-subcomponent-preprocessor/';

module.exports = function nestedComponentsPreprocesser(config = {}) {
  const fileDependencies = {};

  const out = config.out || DEFAULT_OUT;

  return {
    markup: async ({ content, filename }) => {
      let code = content;
      let matches = [...code.matchAll(componentsRE)];
      if (matches.length) {
        const deps = [];
        const files = [];
        let offset = 0;
        for (let i = 0; i < matches.length; i++) {
          const match = matches[i];
          // check that the match has capturing groups (ie. not a comment)
          if (match[1]) {
            // remove matched group
            const begin = match.index + offset;
            const end = begin + match[0].length;
            offset -= match[0].length;
            code = code.substr(0, begin) + code.substr(end);

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
        }
        await Promise.all(files);
        fileDependencies[filename] = deps;

        // Check that the component has a script tag. If not insert one. Otherwise the script preprocess wont get called.
        if (!hasScriptTag(code)) {
          // Add script tag to the component.
          // Needs to have something in the script or script function won't get called during preprocess.
          code = `<script>//subcomponent</script>\n` + code;
        }
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