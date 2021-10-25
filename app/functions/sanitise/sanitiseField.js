// Remove
// - All non Alpha-Numeric Characters
// - All NewLines
// - All multiple instances of white space
exports.sanitiseField = function sanitiseField(field) {
  return field.replace(/\W+/g, '');
};
