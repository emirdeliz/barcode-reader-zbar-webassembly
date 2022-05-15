import {
  checkIsNodeEnvironment,
  checkIsTestEnvironment,
} from 'helpers/global/GlobalHelper';
import { getCCZBarInstance } from './CCZBarWasm';

/**
 * This method validate the if the zbar is running on the environment test and as node.
 * It's important because exists a limitation on the test environment when running as node.
 * About the limitation: ENOENT: no such file or directory, open 'zbar.wasm'
 * @returns boolean - True if the zbar is running on the environment test and as node.
 */
export const checkIfCCZBarIsRunningOnEnvironmentTestOrAsNode = () => {
  return checkIsTestEnvironment() || checkIsNodeEnvironment();
};

/**
 * Converts an array buffer to a string
 * @private
 * @param {ArrayBuffer} buf The buffer to convert
 */
export const arrayBufferToString = (buf: ArrayBuffer) => {
  return new Promise<string>((resolve) => {
    const bb = new Blob([new Uint8Array(buf)]);
    const f = new FileReader();

    f.onload = (e: ProgressEvent<FileReader>) => {
      resolve(e.target?.result as string);
    };
    f.readAsText(bb);
  });
};

/**
 * This method convert a string to UTF8Array.
 * @param {string} str - The string to convert.
 * @param {Uint8Array} outU8Array - The array to store the result.
 * @param {number} outIdx - The index to store the result.
 * @param {number} maxBytesToWrite  - The max bytes to write.
 * @returns {number} - The index to store the result.
 */
export const stringToUTF8Array = (
  str: string,
  outU8Array: Uint8Array,
  outIdx: number,
  maxBytesToWrite: number
) => {
  if (!(maxBytesToWrite > 0)) {
    return 0;
  }
  var startIdx = outIdx;
  var endIdx = outIdx + maxBytesToWrite - 1;
  for (var i = 0; i < str.length; ++i) {
    var u = str.charCodeAt(i);
    if (u >= 55296 && u <= 57343) {
      var u1 = str.charCodeAt(++i);
      u = (65536 + ((u & 1023) << 10)) | (u1 & 1023);
    }
    if (u <= 127) {
      if (outIdx >= endIdx) break;
      outU8Array[outIdx++] = u;
    } else if (u <= 2047) {
      if (outIdx + 1 >= endIdx) break;
      outU8Array[outIdx++] = 192 | (u >> 6);
      outU8Array[outIdx++] = 128 | (u & 63);
    } else if (u <= 65535) {
      if (outIdx + 2 >= endIdx) break;
      outU8Array[outIdx++] = 224 | (u >> 12);
      outU8Array[outIdx++] = 128 | ((u >> 6) & 63);
      outU8Array[outIdx++] = 128 | (u & 63);
    } else {
      if (outIdx + 3 >= endIdx) break;
      outU8Array[outIdx++] = 240 | (u >> 18);
      outU8Array[outIdx++] = 128 | ((u >> 12) & 63);
      outU8Array[outIdx++] = 128 | ((u >> 6) & 63);
      outU8Array[outIdx++] = 128 | (u & 63);
    }
  }
  outU8Array[outIdx] = 0;
  return outIdx - startIdx;
};

/**
 * This method calculate the length in bytes of the string in UTF8.
 * @param {string} str - The string to calculate.
 * @returns {number} - The length in bytes of the string in UTF8.
 */
export const lengthBytesUTF8 = (str: string) => {
  let len = 0;
  for (let i = 0; i < str.length; ++i) {
    let u = str.charCodeAt(i); // possibly a lead surrogate
    if (u >= 0xd800 && u <= 0xdfff)
      u = (0x10000 + ((u & 0x3ff) << 10)) | (str.charCodeAt(++i) & 0x3ff);
    if (u <= 0x7f) {
      ++len;
    } else if (u <= 0x7ff) {
      len += 2;
    } else if (u <= 0xffff) {
      len += 3;
    } else if (u <= 0x1fffff) {
      len += 4;
    } else if (u <= 0x3ffffff) {
      len += 5;
    } else {
      len += 6;
    }
  }
  return len;
};

/**
 * This method allocate the memory for the string in UTF8.
 * @param {string} str - The string to allocate. 
 * @returns {number} - The pointer to memory of the allocate.
 */
export const allocateUTF8 = async (str: string) => {
  const wasm = await getCCZBarInstance();
  const size = lengthBytesUTF8(str) + 1;
  const ret = wasm.malloc(size);
  if (ret) {
    stringToUTF8Array(str, new Uint8Array(wasm.memory.buffer), ret, size);
  }
  return ret;
};
