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

module.exports = {
  stripComments
};