// The same as sanitise, but only returns numeric characters (no decimals).
export default function numbersOnly(field) {
  return field.replace(/\D/g, '');
}
