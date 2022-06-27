/**
 * IMPORTANT: The methods in this file are only used to make the webassembly tests.
 */
import { allocateUTF8 } from './CZBarUtils';
import { getCZBarInstance } from './CZBarWasm';

/**
 * This method to check if barcode is from insurance.
 * @param {string} barcode - The barcode to check.
 * @returns boolean - True if barcode is from insurance.
 */
export const cZbarCheckIfBarcodeIsFromInsurance = async (barcode: string) => {
  const wasm = await getCZBarInstance();
  const response = await wasm.cCheckIfBarcodeIsFromInsurance(barcode);
  const isFromInsurance = response === 0;
  return isFromInsurance;
};

/**
 * This method get the barcode mod (10 or 11).
 * @param {string} barcode - The barcode to get mod.
 * @returns number - The barcode mod.
 */
export const cGetMod = async (barcode: string) => {
  const wasm = await getCZBarInstance();
  const response = await wasm.cGetMod(parseInt(barcode[2], 10));
  return response;
};

/**
 * This method calc the check digit for the segment.
 * @param {string} segment - The barcode segment (string with 11 digits).
 * @returns string - The check digits for the segment.
 */
 export const cCalcCheckDigit = async (segment: string, mod: number) => {
  const wasm = await getCZBarInstance();
  const segmentPointer = await allocateUTF8(segment);
  const response = await wasm.cCalcCheckDigit(segmentPointer, mod);
  await wasm.free(segmentPointer);
  return response;
};
