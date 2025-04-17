export default function mobileValidate(mobile) {
  const regex = /^\+?[ 0-9]{11,20}$/;
  return regex.test(mobile);
}
