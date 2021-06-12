var isPalindrome = function (s) {
  s = s.toUpperCase().replace(/[^0-9A-Z]/g, '');
  return s === s.split('').reverse().join('');
};
