var reverseWords = function (s) {
  s = s.trim();
  return s
    .split(' ')
    .filter((item) => !!item)
    .reverse()
    .join(' ');
};
