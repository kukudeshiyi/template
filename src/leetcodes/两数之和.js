function twoNnumberNum(array, target) {
  if (!Array.isArray(array) || array.length === 0) {
    return;
  }
  const length = array.length;
  for (let i = 0; i < length - 1; i++) {
    for (let j = i + 1; j < length; j++) {
      if (array[i] + array[j] === target) {
        return [i, j];
      }
    }
  }
}
