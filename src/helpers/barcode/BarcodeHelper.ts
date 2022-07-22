import { scanBarcodeAndIgnorePix } from 'barcode';

interface ReadBarCodeProps {
  file?: File;
  filePath?: string;
  scale?: number;
  sequenceNum?: number;
}

const SCALE_START = 3;
const RETRY_INTERVAL = 300;

let hasBarcodeProcessing = false;
export const readBarcodeFromStack = async (props: ReadBarCodeProps) => {
  return new Promise<string>((resolve) => {
    setTimeout(async () => {
      if (hasBarcodeProcessing) {
        resolve(readBarcodeFromStack(props));
      } else {
        hasBarcodeProcessing = true;
        const result = await readBarCode(props);
        resolve(result);
        hasBarcodeProcessing = false;
      }
    }, RETRY_INTERVAL);
  });
};

export const readBarCode = async ({
  file,
  filePath,
  scale = SCALE_START,
  sequenceNum = 0,
}: ReadBarCodeProps) => {
  const result = await scanBarcodeAndIgnorePix(
    file || filePath,
    scale,
    sequenceNum
  );
  return result;
};
