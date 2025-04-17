export default function notBlank(value) {
  return !(value === '' || typeof value === 'undefined' || value === null);
}
