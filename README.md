# Barcode Read - Ts and Webassembly

[![Build](https://github.com/emirdeliz/barcode-reader-zbar-webassembly/actions/workflows/build.yml/badge.svg)](https://github.com/emirdeliz/barcode-reader-zbar-webassembly/actions/workflows/build.yml)
[![Lint](https://github.com/emirdeliz/barcode-reader-zbar-webassembly/actions/workflows/lint.yml/badge.svg)](https://github.com/emirdeliz/barcode-reader-zbar-webassembly/actions/workflows/lint.yml)
[![Test](https://github.com/emirdeliz/barcode-reader-zbar-webassembly/actions/workflows/test.yml/badge.svg)](https://github.com/emirdeliz/barcode-reader-zbar-webassembly/actions/workflows/test.yml)

Barcode reader written in Ts and using webassembly. In addition, it calculates the check digit as well.

Run build.sh to build a docker and update the webassembly.

## Demo

<img src="https://raw.githubusercontent.com/emirdeliz/barcode-reader-zbar-webassembly/master/docs/demo.gif" width="700" height="auto" alt="Upload Largest Files - example"/>

## How to use?

Added the static files (barcode-reader.js and barcode-reader.wasm) on the server. And then use the code below.

```javascript
const result = BarcodeReader.readBarcodeFromStack({
  file,
});
```

or

```javascript
const result = BarcodeReader.readBarcode({
  file,
});
```

##### About the methods:

| **Method**               | **Description**                                                                                                                                                |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **readBarcodeFromStack** | This method receives a ReadBarcodeProps and inserts the request on the stack of requests. This can be utils when you make multiple barcodes reads at the same. |
| **readBarcode**          | This method receives a ReadBarcodeProps and makes a simple read.                                                                                               |

##### About the parameters **ReadBarcodeProps**:

| **Prop**                   | **Type** | **Description**                                                       |
| -------------------------- | -------- | --------------------------------------------------------------------- |
| **file** (optional)        | boolean  | The file related to pdf file.                                         |
| **scale** (optional)       | boolean  | The scale or zoom applied on the pdf document before search barcode.  |
| **sequenceNum** (optional) | Widget   | The sequence number of the image when working with multiple barcodes. |
| **password** (optional)    | Widget   | The password to open the pdf file.                                    |
