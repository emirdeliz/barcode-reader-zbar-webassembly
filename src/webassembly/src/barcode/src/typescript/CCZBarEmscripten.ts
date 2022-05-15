/**
 * All method of this file was used internally by emscripten. Avoid to edit them.
 */
import { checkIsNodeEnvironment } from "framework/helpers";
import { getCCZBarInstance } from "./CCZBarWasm";

/**
 * This method get the clock time in milliseconds. Used internally by emscripten.
 * @param clkId - The clock type.
 * @param {number} tp - The timepoint.
 * @returns {number} - Always 0;
 */
export const clockGetTime = async (clkId: number, tp: number) => {
  const { HEAP32 } = await getCCZBarInstance();
  let now;
  let emscriptenGetNow;
  if (checkIsNodeEnvironment()) {
    emscriptenGetNow = () => {
      const t = process['hrtime']();
      return t[0] * 1e3 + t[1] / 1e6;
    };
  } else {
    emscriptenGetNow = () => performance.now();
  }

  if (clkId === 0) {
    now = Date.now();
  } else if (clkId === 1 || clkId === 4) {
    now = emscriptenGetNow();
  } else {
    return -1;
  }
  HEAP32[tp >> 2] = (now / 1e3) | 0;
  HEAP32[(tp + 4) >> 2] = ((now % 1e3) * 1e3 * 1e3) | 0;
  return 0;
};

/**
 * This method write the data to the memory. Used internally by emscripten.
 * @param {number} _fd - The file descriptor.
 * @param {number} iov - The data to write.
 * @param {number} iovcnt - The number of data to write.
 * @param {number} pnum - The number of bytes written.
 * @returns {number} Always 0.
 */
export const fdWrite = async (_fd: number, iov: number, iovcnt: number, pnum: number) => {
  const { HEAP32 } = await getCCZBarInstance();
  let num = 0;
  for (let i = 0; i < iovcnt; i++) {
    var len = HEAP32[(iov + 4) >> 2];
    iov += 8;
    num += len;
  }
  HEAP32[pnum >> 2] = num;
  return 0;
};

/**
 * This method realloc the webassembly memory. Used internally by emscripten.
 * @param {number} size - The size of the new memory.
 * @returns {number} Always 1.
 */
const emscriptenReallocBuffer = async (size: number) => {
  try {
    const { buffer, memory } = await getCCZBarInstance();
    memory.grow((size - buffer.byteLength + 65535) >>> 16);
    updateGlobalBufferAndViews(memory.buffer);
    return 1;
  } catch (e) {}
};

/**
 * This method align the memory size. Used internally by emscripten.
 * @param {number} x - The x coordinate.
 * @param {number} multiple - The multiple.
 * @returns {number} - The aligned value.
 */
const alignUp = (x: number, multiple: number) => {
  if (x % multiple > 0) {
    x += multiple - (x % multiple);
  }
  return x;
};

/**
 * This method copy the webassembly memory. Used internally by emscripten.
 * @param {number} dest - The destination.
 * @param {number} src - The source.
 * @param {number} num - The number of bytes to copy.
 * @returns {boolean} - True if the copy was successful.
 */
export const emscriptenMemcpyBig = async (dest: number, src: number, num: number) => {
  const { HEAPU8 } = await getCCZBarInstance();
  HEAPU8.copyWithin(dest, src, src + num);
};

/**
 * This method resize the head memory used in the webassembly. Used internally by emscripten.
 * @param {number} requestedSize - The requested size.
 * @returns {boolean} - True if the resize was successful.
 */
export const emscriptenResizeHeap = async (requestedSize: number) => {
  const oldSize = (await getCCZBarInstance()).HEAPU8.length;
  requestedSize = requestedSize >>> 0;

  const maxHeapSize = 2147483648;
  if (requestedSize > maxHeapSize) {
    return false;
  }
  for (let cutDown = 1; cutDown <= 4; cutDown *= 2) {
    let overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
    overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);

    const newSize = Math.min(
      maxHeapSize,
      alignUp(Math.max(requestedSize, overGrownHeapSize), 65536)
    );
    const replacement = await emscriptenReallocBuffer(newSize);
    if (replacement) {
      return true;
    }
  }
  return false;
};

/**
 * This method update the global buffer and views. Used internally by emscripten.
 * @param {ArrayBuffer} buffer - The buffer.
 * @void
 */
export const updateGlobalBufferAndViews = async (buffer: ArrayBuffer) => {
	const ccBarcodeInstance = await getCCZBarInstance();
  ccBarcodeInstance['buffer'] = buffer;
  ccBarcodeInstance['HEAP8'] = new Int8Array(buffer);
  ccBarcodeInstance['HEAP16'] = new Int16Array(buffer);
  ccBarcodeInstance['HEAP32'] = new Int32Array(buffer);
  ccBarcodeInstance['HEAPU8'] = new Uint8Array(buffer);
  ccBarcodeInstance['HEAPU16'] = new Uint16Array(buffer);
  ccBarcodeInstance['HEAPU32'] = new Uint32Array(buffer);
  ccBarcodeInstance['HEAPF32'] = new Float32Array(buffer);
  ccBarcodeInstance['HEAPF64'] = new Float64Array(buffer);
};
