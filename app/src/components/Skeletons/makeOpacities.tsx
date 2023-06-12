export default (cuantity: number, reverse?: true) => {
  const array: number[] = [];

  while (cuantity !== 0)
    array.push(1 / cuantity--)

  return reverse ? array.reverse() : array;
} 