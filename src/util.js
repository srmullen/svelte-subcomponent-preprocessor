const { scriptRE, contextAttrRE } = require('./regexp');

function stripComments(src) {
  let stripped = src;
  const matches = stripped.match(/<!--[\s\S]*-->/g);
  if (matches) {
    for (let i = 0; i < matches.length; i++) {
      const match = stripped.match(/<!--[\s\S]*-->/);
      stripped = stripped.substr(0, match.index) + stripped.substr(match.index + match[0].length);
    }
  }
  return stripped;
}

/**
 * Check if the component source has a non module script tag.
 * @param {string} src 
 */
function hasScriptTag(src) {
  const sansComments = stripComments(src);
  const matches = [...sansComments.matchAll(scriptRE)];
  return Boolean(matches.filter(match => {
    const attrs = match[1];
    if (!attrs) {
      return true;
    } else {
      // check that the script isn't a module context.
      return !attrs.match(contextAttrRE);
    }
  }).length);
}

module.exports = {
  hasScriptTag,
  stripComments
};