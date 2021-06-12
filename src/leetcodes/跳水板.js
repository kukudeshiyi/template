var divingBoard = function (shorter, longer, k) {
  if (k === 0) {
    return [];
  }
  if (shorter === longer) {
    return [shorter * k];
  }
  var results = [],
    total = k;
  var longerNum = 0,
    shorterNum = k;
  while (shorterNum <= 0) {
    longerNum = total - shorterNum;
    results.push(shorterNum * shorter + longerNum * longer);
    shorterNum--;
  }
  return results;
};
