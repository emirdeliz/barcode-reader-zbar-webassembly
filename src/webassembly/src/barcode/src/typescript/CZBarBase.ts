/**
 * The class CZBarBase has the base methods of zbar to comunicate with the webassembly.  
 */
import { CZBarBarcodeWasm } from './CZBarWasm';

export class CZBarBase {
  protected ptr: number;
  protected inst: CZBarBarcodeWasm;

  /**
   * The constructor of the class CZBarBase.
   * @param {number} ptr - The memory pointer of this class on webassembly.
   * @param {CZBarBarcodeWasm} inst - The instance of the wasm to comunicate with webassembly.
   */
  protected constructor(ptr: number, inst: CZBarBarcodeWasm) {
    this.ptr = ptr;
    this.inst = inst;
  }

  /**
   * This method checks if the class instance has in the webassembly memory yet
   * @throws - Call after destroyed.
   */
  protected checkAlive() {
    if (this.ptr) {
      return;
    }
    throw Error('Call after destroyed');
  }

  /**
   * This method get the memory pointer of this class.
   * @returns {number} - The memory pointer of this class on webassembly.
   */
  getPointer() {
    this.checkAlive();
    return this.ptr;
  }
}