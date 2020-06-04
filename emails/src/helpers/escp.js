/**
 * use the given name as a variable for marketing cms
 * @example
 * {{escp 'firstName'}}
 * @outputs
 * {{{firstName}}}
 */
module.exports = function(content) {
  return "<%- " + content + " %>";
};
