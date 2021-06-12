var removeDuplicates = function (nums) {
  var p = 0,
    q = 1;
  while (q < nums.length) {
    if (nums[p] !== nums[q]) {
      if (q - p > 1) {
        nums[p + 1] = nums[q];
      }
      p++;
    }
    q++;
  }
  return nums;
};
