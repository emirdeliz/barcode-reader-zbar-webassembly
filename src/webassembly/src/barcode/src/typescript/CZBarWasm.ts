import { GenericObject } from 'framework/types';
import fs from 'fs';
import path from 'path';
import {
  clockGetTime,
  emscriptenMemcpyBig,
  emscriptenResizeHeap,
  fdWrite,
  updateGlobalBufferAndViews,
} from './CZBarEmscripten';
import { checkIfCZBarIsRunningOnEnvironmentTestOrAsNode } from './CZBarUtils';

export const CZBAR_WASM_BINARY_FILE = 'cbarcode.wasm';
let cBarcodeInstance = {} as CZBarBarcodeWasm;

export interface CWasm {
  cCalcCheckDigit: (segmentPtr: number, mod: number) => Promise<string>;
  cGetMod: (barcode: number) => Promise<number>;
  cCheckIfBarcodeIsFromInsurance: (barcode: string) => Promise<number>;
}

export interface CZBarWasm {
  cZBarImageCreate: (
    width: number,
    height: number,
    hex: number,
    buf: number,
    len: number,
    sequenceNum: number
  ) => number;
  cZBarImageScannerScanAndMaybeApplyCheckDigit: (
    ptr: number,
    byteOffset: number,
    ignorePix: number
  ) => Promise<number>;
}

/**
 * This interface represente the wasm module to the webassembly.
 */
export interface CZBarBarcodeWasm extends CZBarWasm, CWasm {
  malloc: (size: number) => number;
  free: (pointer: number) => Promise<void>;
  memory: WebAssembly.Memory;
  print: () => void;
  printErr: () => void;
  arguments: Array<GenericObject>;
  buffer: ArrayBuffer;
  HEAP8: Int8Array;
  HEAP16: Int16Array;
  HEAP32: Int32Array;
  HEAPU8: Uint8Array;
  HEAPU16: Uint16Array;
  HEAPU32: Uint32Array;
  HEAPF32: Float32Array;
  HEAPF64: Float64Array;
}

/**
 * This method will fetch the cwasm module.
 * @returns {Promise<WebAssembly.WebAssemblyInstantiatedSource>} - The wasm module.
 */
const fetchCZBarWasm = async () => {
  const asmLibraryArg = {
    f: clockGetTime,
    c: emscriptenMemcpyBig,
    d: emscriptenResizeHeap,
    a: fdWrite,
    e: () => {},
    b: () => {},
  };

  const info = { a: asmLibraryArg };
  if (checkIfCZBarIsRunningOnEnvironmentTestOrAsNode()) {
    const wasmFileLocalDir = path.resolve(
      __dirname,
      '../../../../../../public',
      CZBAR_WASM_BINARY_FILE
    );
    const data = fs.readFileSync(wasmFileLocalDir);
    return WebAssembly.instantiate(data, info);
  }

  const response = await fetch(CZBAR_WASM_BINARY_FILE);
  const bytes = await response.arrayBuffer();
  return WebAssembly.instantiate(bytes, info);
};

/**
 * This method make a bridge between the webassembly and the c code.
 * @returns {CZBarBarcodeWasm} - The webassembly instance.
 */
const prepareCZBarWasm = async () => {
  const ex = await fetchCZBarWasm();
  const asm = ex.instance.exports;
  cBarcodeInstance = {
    cZBarImageCreate: asm.m,
    cZBarImageScannerScanAndMaybeApplyCheckDigit: asm.n,
    cCheckIfBarcodeIsFromInsurance: asm.l,
    cGetMod: asm.k,
    cCalcCheckDigit: asm.j,
    malloc: asm.i,
    free: asm.q,
    memory: asm.g,
  } as CZBarBarcodeWasm;
  updateGlobalBufferAndViews(cBarcodeInstance.memory.buffer);
  return cBarcodeInstance;
};

/**
 * This method will return and create the webassembly instance.
 * @returns {CZBarBarcodeWasm} - The webassembly instance.
 */
export const getCZBarInstance = async () => {
  if (!cBarcodeInstance.free) {
    cBarcodeInstance = await prepareCZBarWasm();
  }
  return cBarcodeInstance;
};
