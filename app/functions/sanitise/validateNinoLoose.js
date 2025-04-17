// You can make the last letter of the NINO optional by using this function.
export default function ninoValidateLoose(nino) {
  const regex = /^(?!BG|GB|NK|KN|TN|NT|ZZ)[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-D]{0,1}$/;
  return regex.test(nino);
}
