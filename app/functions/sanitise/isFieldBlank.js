exports.notBlank = function notBlank(value) {
  if (value === '' || typeof value === 'undefined' || value === null) {
    return false;
  }
  return true;
};
