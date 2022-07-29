import fs from 'fs';
import {
	checkIsNodeEnvironment,
	checkIsTestEnvironment,
	wasmPathGlobal,
} from '@/helpers';
import path from 'path';
import {
	clockGetTime,
	emscriptenMemcpyBig,
	emscriptenResizeHeap,
	fdWrite,
	updateGlobalBufferAndViews,
} from './CZBarEmscripten';

/**
 * This method validate the if the zbar is running on the environment test and as node.
 * It's important because exists a limitation on the test environment when running as node.
 * About the limitation: ENOENT: no such file or directory, open 'zbar.wasm'
 * @returns boolean - True if the zbar is running on the environment test and as node.
 */
export const checkIfCZBarIsRunningOnEnvironmentTestOrAsNode = () => {
	return checkIsTestEnvironment() || checkIsNodeEnvironment();
};

export const CZBAR_WASM_BINARY_FILE = 'barcode-reader.wasm';
let cBarcodeInstance = {} as CZBarBarcodeWasm;

export interface CWasm {
	cGetMod: (barcode: number) => Promise<number>;
	cCalcCheckDigit: (segmentPtr: number, mod: number) => Promise<string>;
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
	arguments: Array<any>;
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
const fetchCZBarWasm =
	async (): Promise<WebAssembly.WebAssemblyInstantiatedSource> => {
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
				'../../dist',
				CZBAR_WASM_BINARY_FILE
			);

			const data = fs.readFileSync(wasmFileLocalDir);
			return WebAssembly.instantiate(data, info);
		}

		const baseUrl = wasmPathGlobal ? `${wasmPathGlobal}/` : '';
		const response = await fetch(`${baseUrl}${CZBAR_WASM_BINARY_FILE}`);
		const bytes = await response.arrayBuffer();
		return WebAssembly.instantiate(bytes, info);
	};

/**
 * This method make a bridge between the webassembly and the c code.
 * @returns {Promise<CZBarBarcodeWasm>} - The webassembly instance.
 */
const prepareCZBarWasm = async (): Promise<CZBarBarcodeWasm> => {
	const ex = await fetchCZBarWasm();
	const asm = ex.instance.exports;

	cBarcodeInstance = {
		cZBarImageCreate: asm.m,
		cZBarImageScannerScanAndMaybeApplyCheckDigit: asm.n,
		cGetMod: asm.k,
		cCalcCheckDigit: asm.j,
		cCheckIfBarcodeIsFromInsurance: asm.l,
		malloc: asm.i,
		free: asm.q,
		memory: asm.g,
	} as CZBarBarcodeWasm;
	updateGlobalBufferAndViews(cBarcodeInstance.memory.buffer);
	return cBarcodeInstance;
};

/**
 * This method will return and create the webassembly instance.
 * @returns {Promise<CZBarBarcodeWasm>} - The webassembly instance.
 */
export const getCZBarInstance = async (): Promise<CZBarBarcodeWasm> => {
	if (!cBarcodeInstance.free) {
		cBarcodeInstance = await prepareCZBarWasm();
	}
	return cBarcodeInstance;
};
