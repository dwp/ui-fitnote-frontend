// Remove
// - All non Alpha-Numeric Characters
// - All NewLines
// - All multiple instances of white space
export default function sanitiseField(field) {
  return field.replace(/\W+/g, '');
}
