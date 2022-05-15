/**
 * @jest-environment node
 */
import {
  barcodeDeposit,
  barcodeInsuranceWithoutDigit,
  barcodeInsuranceWithoutDigit2,
  barcodeInsuranceWithoutDigit3,
  barcodeInsuranceWithoutDigit4,
  barcodeInsuranceWithoutDigit5
} from 'tests';
import {
  ccCalcCheckDigit,
  ccGetMod,
  ccZbarCheckIfBarcodeIsFromInsurance,
} from './CCZBarBarcode';
import { getCCZBarInstance } from './CCZBarWasm';

describe('/cpp/src/barcode/src/typescript/CCZBarWasm', () => {
  it('Should have an CCZBar instance', async () => {
    const result = getCCZBarInstance();
    expect(result).not.toBeNull();
  });

  it('Should havent an CCZBar insurance barcode', async () => {
    const result = await ccZbarCheckIfBarcodeIsFromInsurance(barcodeDeposit);
    expect(result).toBeFalsy();
  });

  it('Should have a check digit for 85660000001-7 01510024720-2 00247591920-1 00220021353-2', async () => {
    const mod = await ccGetMod(barcodeInsuranceWithoutDigit);
    const resultFirst = await ccCalcCheckDigit(
      barcodeInsuranceWithoutDigit.substring(0),
      mod
    );
    expect(resultFirst).toEqual(7);

    const resultSecond = await ccCalcCheckDigit(
      barcodeInsuranceWithoutDigit.substring(11, 22),
      mod
    );
    expect(resultSecond).toEqual(2);

    const resultThird = await ccCalcCheckDigit(
      barcodeInsuranceWithoutDigit.substring(22, 33),
      mod
    );
    expect(resultThird).toEqual(1);

    const resultFourth = await ccCalcCheckDigit(
      barcodeInsuranceWithoutDigit.substring(33, 44),
      mod
    );
    expect(resultFourth).toEqual(2);
  });

  it('Should have a check digit for 85860000001-2 21220385213-0 54071621350-9 96839813294-8', async () => {
    const mod = await ccGetMod(barcodeInsuranceWithoutDigit2);
    const resultFirst = await ccCalcCheckDigit(
      barcodeInsuranceWithoutDigit2.substring(0, 11),
      mod
    );
    expect(resultFirst).toEqual(2);

    const resultSecond = await ccCalcCheckDigit(
      barcodeInsuranceWithoutDigit2.substring(11, 22),
      mod
    );
    expect(resultSecond).toEqual(0);

    const resultThird = await ccCalcCheckDigit(
      barcodeInsuranceWithoutDigit2.substring(22, 33),
      mod
    );
    expect(resultThird).toEqual(9);

    const resultFourth = await ccCalcCheckDigit(
      barcodeInsuranceWithoutDigit2.substring(33, 44),
      mod
    );
    expect(resultFourth).toEqual(8);
  });

  it('Should have a check digit for 84630000000-7 29990296202-0 00410136000-7 000200644114-0', async () => {
    const mod = await ccGetMod(barcodeInsuranceWithoutDigit3);
    const resultFirst = await ccCalcCheckDigit(
      barcodeInsuranceWithoutDigit3.substring(0, 11),
      mod
    );
    expect(resultFirst).toEqual(7);

    const resultSecond = await ccCalcCheckDigit(
      barcodeInsuranceWithoutDigit3.substring(11, 22),
      mod
    );
    expect(resultSecond).toEqual(0);

    const resultThird = await ccCalcCheckDigit(
      barcodeInsuranceWithoutDigit3.substring(22, 33),
      mod
    );
    expect(resultThird).toEqual(7);

    const resultFourth = await ccCalcCheckDigit(
      barcodeInsuranceWithoutDigit3.substring(33, 44),
      mod
    );
    expect(resultFourth).toEqual(0);
  });

  it('Should have a check digit for 83630000000-4 86170162000-2 00101020217-2 67028153602-9', async () => {
    const mod = await ccGetMod(barcodeInsuranceWithoutDigit4);
    const resultFirst = await ccCalcCheckDigit(
      barcodeInsuranceWithoutDigit4.substring(0, 11),
      mod
    );
    expect(resultFirst).toEqual(4);

    const resultSecond = await ccCalcCheckDigit(
      barcodeInsuranceWithoutDigit4.substring(11, 22),
      mod
    );
    expect(resultSecond).toEqual(2);

    const resultThird = await ccCalcCheckDigit(
      barcodeInsuranceWithoutDigit4.substring(22, 33),
      mod
    );
    expect(resultThird).toEqual(2);

    const resultFourth = await ccCalcCheckDigit(
      barcodeInsuranceWithoutDigit4.substring(33, 44),
      mod
    );
    expect(resultFourth).toEqual(9);
  });

  it('Should have a check digit for 83610000000-6 46000192000-4 00383905700-1 00082858680-0', async () => {
    const mod = await ccGetMod(barcodeInsuranceWithoutDigit5);
    const resultFirst = await ccCalcCheckDigit(
      barcodeInsuranceWithoutDigit5.substring(0, 11),
      mod
    );
    expect(resultFirst).toEqual(6);

    const resultSecond = await ccCalcCheckDigit(
      barcodeInsuranceWithoutDigit5.substring(11, 22),
      mod
    );
    expect(resultSecond).toEqual(4);

    const resultThird = await ccCalcCheckDigit(
      barcodeInsuranceWithoutDigit5.substring(22, 33),
      mod
    );
    expect(resultThird).toEqual(1);

    const resultFourth = await ccCalcCheckDigit(
      barcodeInsuranceWithoutDigit5.substring(33, 44),
      mod
    );
    expect(resultFourth).toEqual(0);
  });
});
