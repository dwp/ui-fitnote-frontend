// You can make the last letter of the NINO mandatory by using this function.
exports.ninoValidateStrict = function ninoValidateStrict(nino) {
  const regex = /^(?!BG|GB|NK|KN|TN|NT|ZZ)[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-D]{1}$/;
  return regex.test(nino);
};
