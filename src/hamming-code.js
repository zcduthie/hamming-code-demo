/**
 * hammingEncode - Generates a codeword from a binary string using the Hamming Code algorithm as in Tanenbaum and Wikipedia.
 * @param {string} data - Binary string. 10011010
 * @param {number} parity - Even or odd parity. 0 for even. 1 for odd.
 * @returns {string} - Binary encoded string.
 */
export function hammingEncode(data, parity) {
  if (typeof data !== 'string' || data.match(/[^10]/)) {
    return console.error('hammingEncode error: data should be binary string, for example "10011010"');
  }

  if (typeof parity !== 'number' || (parity !== 0 && parity !== 1)) {
    return console.error('hammingEncode error: parity should be 0 (even) or 1 (odd)');
  }

  // Start off with the input
  let codeword = data.split('');

  // Go through and add parity bits

  // For the algorithm:
  // We number the bits starting from 1: bit 1, 2, 3, 4, 5

  // All bit positions that are powers of two (have a single 1 bit in the binary
  // form of their position) are parity bits: 1, 2, 4, 8, etc (1, 10, 100, 1000)

  // We do two passes of the array.
  // First one we just put placeholder parity bit values in (0).
  // We'll come back through and populate them with the right value after.
  for (let i = 1; i <= codeword.length; i *= 2) {
    // Add parity bit at index i (each power of 2)
    // (Remember that i is indexed starting from 1)
    codeword.splice(i-1, 0, 0); // init to 0. whatever
  }

  /*
   * Loop through each parity bit and set its value.
   * Parity bit 1 covers all bit positions which have the least significant bit set: bit 1 (the parity bit itself), 3, 5, 7, 9, etc.
   * Parity bit 2 covers all bit positions which have the second least significant bit set: bit 2 (the parity bit itself), 3, 6, 7, 10, 11, etc.
   * Parity bit 4 covers all bit positions which have the third least significant bit set: bits 4–7, 12–15, 20–23, etc.
   * Parity bit 8 covers all bit positions which have the fourth least significant bit set: bits 8–15, 24–31, 40–47, etc.
   * In general each parity bit covers all bits where the bitwise AND of the parity position and the bit position is non-zero.
  */
  for (let i = 1; i <= codeword.length; i *= 2) {

    let parityValue = codeword
      .filter((currentValue, index) => (index+1) & i)
      .reduce((accumulator, currentValue) => accumulator ^ currentValue);

    parityValue ^= parity;

    codeword[i - 1] = parityValue;
  }

  return codeword.join('');
}


/**
 * hammingDecode - Extracts data bits from a codeword using the Hamming Code algorithm as in Tanenbaum and Wikipedia.
 * @param {string} rawCodeword - Binary string. 011100101010
 * @param {number} parity - Even or odd parity. 0 for even. 1 for odd.
 * @returns {string} - Binary encoded data string.
 */
export function hammingDecode(rawCodeword, parity) {
  if (typeof rawCodeword !== 'string' || rawCodeword.match(/[^10]/)) {
    return console.error('hammingDecode error: codeword should be binary string, for example "011100101010"');
  }

  if (typeof parity !== 'number' || (parity !== 0 && parity !== 1)) {
    return console.error('hammingDecode error: parity should be 0 (even) or 1 (odd)');
  }

  // Start off with the input
  let codeword = rawCodeword.split('');

  let erroneousParityBitSum = 0;

  for (let i = 1; i <= codeword.length; i *= 2) {

    let parityValue = codeword
      .filter((currentValue, index) =>  (index+1) & i)
      .reduce((accumulator, currentValue) => accumulator ^ currentValue);

    console.log(`${i}: ${parityValue}`);

    // parityValue ^= parity;

    // codeword[i - 1] = parityValue;
    if (parityValue !== parity) {
      erroneousParityBitSum += i;
    }
  }

  console.log(erroneousParityBitSum);

  if (erroneousParityBitSum > 0)
    codeword[erroneousParityBitSum-1] ^= 1;

  console.log('before: ', codeword.join(''));

  let data = [];

  let parityBit = 1;
  for (let i = 1; i <= codeword.length; i++) {
    if (i === parityBit) {
      // It's a parity bit. Ignore
      parityBit *= 2;
      // Update parity bit to next one
    } else {
      data.push(codeword[i-1]);
    }
  }

  console.log('after: ', data.join(''));

  return data.join('');
}
