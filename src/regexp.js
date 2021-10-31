// This regular expression matches html comments and #component blocks, but it only captures groups for
// component blocks. So if a match doesn't have a capture group, then it is a comment.
const componentsRE = /<!--[\s\S]*-->|{#component\s+([A-Za-z]+[0-9]*)\s*}([\s\S]*?){\/component}/g;

module.exports = {
  componentsRE
};