// The same as sanitise, but only returns numeric characters (no decimals).
exports.numbersOnly = function numbersOnly(field) {
  return field.replace(/\D/g, '');
};
