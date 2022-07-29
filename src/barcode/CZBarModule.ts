import { createCanvas } from 'canvas';
import * as PDFJS from 'pdfjs-dist/legacy/build/pdf.js';
import { getNumbersOfString } from '@/helpers';
import { checkIsNodeEnvironment } from '@/helpers/global/GlobalHelper';
import { CZBarImage } from './CZBarImage';
import { getCZBarInstance } from './CZBarWasm';
import { PDFDocumentProxy } from 'pdfjs-dist/types/web/pdf_find_controller';

if (!checkIsNodeEnvironment()) {
  PDFJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.min.js`;
}
/**
 * The variable PDF_NUM_MAX_PAGES defines the maximum
 * number of scan retries if the barcode is not found.
 */
const PDF_NUM_MAX_PAGES = 5;
/**
 * The variable SCALE_STEP determines the scale increment of the next scan if the barcode is not found.
 */
const SCALE_STEP = 0.6;
/**
 * The variable SCALE_LIMIT determines the scale limit to try to read again when barcode is not found.
 */
const SCALE_LIMIT = 5;

/**
 * This method get the document of barcode using pdfjs.
 * @param {string} src - The url or file related to pdf file.
 * @returns {Promise<PDFDocumentProxy>} - The pdf document as pdfjs proxy.
 */
const getCZBarBarcodePdf = async (src: string | File): Promise<PDFDocumentProxy> => {
  const isSrcString = typeof src === 'string';
  const pdfData = await new Promise<string | Uint8Array>((resolve) => {
    if (isSrcString) {
      resolve(src as string);
    }

    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      const typedarray = new Uint8Array(e.target?.result as ArrayBuffer);
      resolve(typedarray);
    };
    fileReader.readAsArrayBuffer(src as File);
  });

  const pdf = await PDFJS.getDocument(pdfData).promise;
  return pdf;
};

/**
 * This method get the image data of the pdf document.
 * @param {PDFDocumentProxy} pdf - The pdf document as pdfjs proxy.
 * @param {number} scale - The scale or zoom applied on the pdf document before search barcode.
 * @param {number} page - The page number to find the barcode.
 * @returns {Promise<ImageData>} - The image data related to the page of pdf document.
 */
const getCZBarImageData = async (
  pdf: PDFJS.PDFDocumentProxy,
  scale: number,
  page: number = 1
): Promise<ImageData> => {
  if (page > pdf.numPages) {
    return null;
  }

  const pdfPage = await pdf.getPage(page);
  const viewport = pdfPage.getViewport({ scale });
  const width = viewport.width;
  const height = viewport.height;

  const canvas = createCanvas(width, height);
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  ctx &&
    (await pdfPage.render({ canvasContext: ctx, viewport: viewport }).promise);
  return ctx?.getImageData(0, 0, width, height);
};

/**
 * This method scan the barcode of the pdf document. This method can repeat the scan
 * until it finds the barcode or the maximum number of pages (PDF_NUM_MAX_PAGES) is reached.
 * @param {PDFDocumentProxy} pdf - The pdf document as pdfjs proxy.
 * @param {number} sequenceNum - The sequence number of the image.
 * @param {number} scale - The scale or zoom applied on the pdf document before search barcode.
 * @param {number} page - The page number to find the barcode.
 * @returns {Promise<string>} - The barcode as string.
 */
const scanBarcode = async (
  pdf: PDFJS.PDFDocumentProxy,
  sequenceNum: number,
  scale: number,
  page: number = 0
): Promise<string> => {
  const imageData = await getCZBarImageData(pdf, scale, page + 1);
  if (!imageData) {
    return '';
  }
  const image = await CZBarImage.createFromGrayBuffer(
    imageData.width,
    imageData.height,
    imageData.data.buffer,
    sequenceNum
  );

  const cBarInstance = await getCZBarInstance();
  const barcodeLength = 48;
  const barcodeMinLength = 44;
  const result = new Uint8Array(cBarInstance.memory.buffer, 0, barcodeLength);

  const ignorePix = 0;
  await cBarInstance.cZBarImageScannerScanAndMaybeApplyCheckDigit(
    image.getPointer(),
    result.byteOffset,
    ignorePix
  );

  const barcode = getNumbersOfString(new TextDecoder().decode(result));
  if (!barcode || barcode.length < barcodeMinLength) {
		const nextPdfPage = page + 1;
		const reachedMaximumNumberOfScans = nextPdfPage >= PDF_NUM_MAX_PAGES;
		if (!reachedMaximumNumberOfScans) {
			const result = (await scanBarcode(
				pdf,
				sequenceNum,
				scale,
				nextPdfPage
			)) as string;
			return result;
		}
	}
  return barcode;
};

/**
 * This method scan the barcode of the pdf document ignoring the pix.
 * This method can repeat the scan until it finds the barcode or the scale (SCALE_LIMIT) is reached.
 * @param {File|string} src - The url or file related to pdf file.
 * @param {number} scale - The scale or zoom applied on the pdf document before search barcode.
 * @param {number} sequenceNum - The sequence number of the image.
 * @returns {Promise<string>} - The barcode founded as string. Usually passed as 0.
 */
export const scanBarcodeAndIgnorePix = async (
	src?: File | string,
	scale: number = 1,
	sequenceNum: number = 0
): Promise<string> => {
	const reachedScale = scale > SCALE_LIMIT;
	if (!src || reachedScale) {
		return '';
	}

	const pdf = await getCZBarBarcodePdf(src);
	const barcode = await scanBarcode(pdf, sequenceNum, scale);

	if (!barcode) {
		const response = await new Promise<string>((resolve) => {
			setTimeout(async () => {
				const r = (await scanBarcodeAndIgnorePix(
					src,
					scale + SCALE_STEP
				)) as string;
				resolve(r);
			}, 500);
		});
		return response;
	}

	return barcode;
};
