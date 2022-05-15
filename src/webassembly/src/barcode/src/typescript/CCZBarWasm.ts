import { GenericObject } from 'framework/types';
import fs from 'fs';
import path from 'path';
import {
  clockGetTime,
  emscriptenMemcpyBig,
  emscriptenResizeHeap,
  fdWrite,
  updateGlobalBufferAndViews,
} from './CCZBarEmscripten';
import { checkIfCCZBarIsRunningOnEnvironmentTestOrAsNode } from './CCZBarUtils';

export const CCZBAR_WASM_BINARY_FILE = 'ccbarcode.wasm';
let ccBarcodeInstance = {} as CCZBarBarcodeWasm;

export interface CCWasm {
  ccCalcCheckDigit: (segmentPtr: number, mod: number) => Promise<string>;
  ccGetMod: (barcode: number) => Promise<number>;
  ccCheckIfBarcodeIsFromInsurance: (barcode: string) => Promise<number>;
}

export interface CCZBarWasm {
  ccZBarImageCreate: (
    width: number,
    height: number,
    hex: number,
    buf: number,
    len: number,
    sequenceNum: number
  ) => number;
  ccZBarImageScannerScanAndMaybeApplyCheckDigit: (
    ptr: number,
    byteOffset: number,
    ignorePix: number
  ) => Promise<number>;
}

/**
 * This interface represente the wasm module to the webassembly.
 */
export interface CCZBarBarcodeWasm extends CCZBarWasm, CCWasm {
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
 * This method will fetch the ccwasm module.
 * @returns {Promise<WebAssembly.WebAssemblyInstantiatedSource>} - The wasm module.
 */
const fetchCCZBarWasm = async () => {
  const asmLibraryArg = {
    f: clockGetTime,
    c: emscriptenMemcpyBig,
    d: emscriptenResizeHeap,
    a: fdWrite,
    e: () => {},
    b: () => {},
  };

  const info = { a: asmLibraryArg };
  if (checkIfCCZBarIsRunningOnEnvironmentTestOrAsNode()) {
    const wasmFileLocalDir = path.resolve(
      __dirname,
      '../../../../../../public',
      CCZBAR_WASM_BINARY_FILE
    );
    const data = fs.readFileSync(wasmFileLocalDir);
    return WebAssembly.instantiate(data, info);
  }

  const response = await fetch(CCZBAR_WASM_BINARY_FILE);
  const bytes = await response.arrayBuffer();
  return WebAssembly.instantiate(bytes, info);
};

/**
 * This method make a bridge between the webassembly and the c code.
 * @returns {CCZBarBarcodeWasm} - The webassembly instance.
 */
const prepareCCZBarWasm = async () => {
  const ex = await fetchCCZBarWasm();
  const asm = ex.instance.exports;
  ccBarcodeInstance = {
    ccZBarImageCreate: asm.m,
    ccZBarImageScannerScanAndMaybeApplyCheckDigit: asm.n,
    ccCheckIfBarcodeIsFromInsurance: asm.l,
    ccGetMod: asm.k,
    ccCalcCheckDigit: asm.j,
    malloc: asm.i,
    free: asm.q,
    memory: asm.g,
  } as CCZBarBarcodeWasm;
  updateGlobalBufferAndViews(ccBarcodeInstance.memory.buffer);
  return ccBarcodeInstance;
};

/**
 * This method will return and create the webassembly instance.
 * @returns {CCZBarBarcodeWasm} - The webassembly instance.
 */
export const getCCZBarInstance = async () => {
  if (!ccBarcodeInstance.free) {
    ccBarcodeInstance = await prepareCCZBarWasm();
  }
  return ccBarcodeInstance;
};
