/**
 * @jest-environment node
 */
import { getBilletPathAndBarcodeNumber } from '__mock__/helpers';
import { splitStringBySegmentLength } from '../string/StringHelper';
import { readBarcodeFromStack } from './BarcodeHelper';

jest.setTimeout(15000);

describe('framework/helpers/barcode', () => {
  beforeAll(() => {
    jest.spyOn(globalThis.console, 'log').mockImplementation(() => undefined);
    jest.spyOn(globalThis.console, 'warn').mockImplementation(() => undefined);
    jest.spyOn(globalThis.console, 'error').mockImplementation(() => undefined);
  });

  it('Should have a InputBarcode from Campelo', async () => {
    const { barcode, path } = getBilletPathAndBarcodeNumber()[0];
    const result = await readBarcodeFromStack({ filePath: path });
    expect(result).toEqual(barcode);
  });

  it('Should have a InputBarcode from Celesc', async () => {
    const { barcode, path } = getBilletPathAndBarcodeNumber()[1];
    const result = await readBarcodeFromStack({ filePath: path });
    expect(result).toEqual(barcode);
  });

  it('Should have a InputBarcode from Gps', async () => {
    const { barcode, path } = getBilletPathAndBarcodeNumber()[2];
    const result = await readBarcodeFromStack({
      filePath: path,
    });
    expect(result).toEqual(barcode);
  });

  it('Should have a InputBarcode from Super Gasbras', async () => {
    const { barcode, path } = getBilletPathAndBarcodeNumber()[3];
    const result = await readBarcodeFromStack({
      filePath: path,
    });
    expect(result).toEqual(barcode);
  });

  it('Should have a InputBarcode from Net black and white', async () => {
    const { barcode, path } = getBilletPathAndBarcodeNumber()[4];
    const result = await readBarcodeFromStack({
      filePath: path,
    });
    expect(result).toEqual(barcode);
  });

  it('Should have a InputBarcode from Detran', async () => {
    const { barcode, path } = getBilletPathAndBarcodeNumber()[5];
    const result = await readBarcodeFromStack({ filePath: path });
    expect(result).toEqual(barcode);
  });

  it('Should have a InputBarcode from Nubank', async () => {
    const { barcode, path } = getBilletPathAndBarcodeNumber()[6];
    const result = await readBarcodeFromStack({
      filePath: path,
    });
    expect(result).toEqual(barcode);
  });

  it('Should have a InputBarcode from Contabilivre with barcode on second page', async () => {
    const { barcode, path } = getBilletPathAndBarcodeNumber()[7];
    const result = await readBarcodeFromStack({ filePath: path });
    const resultWithoutCheckDigit = splitStringBySegmentLength(
      result,
      2,
      10
    ).join('');
    const barcodeWithoutCheckDigit = splitStringBySegmentLength(
      barcode,
      2,
      10
    ).join('');
    expect(resultWithoutCheckDigit).toEqual(barcodeWithoutCheckDigit);
  });

  it('Should have a InputBarcode from Cora', async () => {
    const { barcode, path } = getBilletPathAndBarcodeNumber()[8];
    const result = await readBarcodeFromStack({ filePath: path });
    const resultWithoutCheckDigit = splitStringBySegmentLength(
      result,
      2,
      10
    ).join('');
    const barcodeWithoutCheckDigit = splitStringBySegmentLength(
      barcode,
      2,
      10
    ).join('');
    expect(resultWithoutCheckDigit).toEqual(barcodeWithoutCheckDigit);
  });

  it('Should have a InputBarcode from Cora with duedate on weekend', async () => {
    const { barcode, path } = getBilletPathAndBarcodeNumber()[9];
    const result = await readBarcodeFromStack({ filePath: path });
    const resultWithoutCheckDigit = splitStringBySegmentLength(
      result,
      2,
      10
    ).join('');
    const barcodeWithoutCheckDigit = splitStringBySegmentLength(
      barcode,
      2,
      10
    ).join('');
    expect(resultWithoutCheckDigit).toEqual(barcodeWithoutCheckDigit);
  });

  it('Should have a InputBarcode from Judicial Deposit Guide', async () => {
    const { barcode, path } = getBilletPathAndBarcodeNumber()[10];
    const result = await readBarcodeFromStack({ filePath: path });
    const resultWithoutCheckDigit = splitStringBySegmentLength(
      result,
      2,
      10
    ).join('');
    const barcodeWithoutCheckDigit = splitStringBySegmentLength(
      barcode,
      2,
      10
    ).join('');
    expect(resultWithoutCheckDigit).toEqual(barcodeWithoutCheckDigit);
  });
});
