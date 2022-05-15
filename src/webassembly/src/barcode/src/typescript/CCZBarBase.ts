/**
 * The class CCZBarBase has the base methods of zbar to comunicate with the webassembly.  
 */
import { CCZBarBarcodeWasm } from './CCZBarWasm';

export class CCZBarBase {
  protected ptr: number;
  protected inst: CCZBarBarcodeWasm;

  /**
   * The constructor of the class CCZBarBase.
   * @param {number} ptr - The memory pointer of this class on webassembly.
   * @param {CCZBarBarcodeWasm} inst - The instance of the wasm to comunicate with webassembly.
   */
  protected constructor(ptr: number, inst: CCZBarBarcodeWasm) {
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