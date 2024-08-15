export function shuffleArray<T>(array: T[]): T[] {
  const randomizedArray = [ ...array ];

  for (let index = 0; index < array.length; ++index) {
    const randomIndex = Math.floor(Math.random() * array.length);
    // The indexes will always be within the bounds of array
    // eslint-disable-next-line typescript-eslint/no-non-null-assertion
    [ randomizedArray[index], randomizedArray[randomIndex] ] = [ randomizedArray[randomIndex]!, randomizedArray[index]! ];
  }

  return randomizedArray;
}
