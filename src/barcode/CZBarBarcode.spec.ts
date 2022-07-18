/**
 * @jest-environment node
 */
import {
  barcodeDeposit,
  barcodeInsuranceWithoutDigit,
  barcodeInsuranceWithoutDigit2,
  barcodeInsuranceWithoutDigit3,
  barcodeInsuranceWithoutDigit4,
  barcodeInsuranceWithoutDigit5,
} from '__mock__/helpers';
import {
  calcheckDigit,
  cGetMod,
  cZbarCheckIfBarcodeIsFromInsurance,
} from './CZBarBarcode';
import { getCZBarInstance } from './CZBarWasm';

describe('/cpp/src/barcode/src/typescript/CZBarWasm', () => {
  it('Should have an CZBar instance', async () => {
    const result = getCZBarInstance();
    expect(result).not.toBeNull();
  });

  it('Should havent an CZBar insurance barcode', async () => {
    const result = await cZbarCheckIfBarcodeIsFromInsurance(barcodeDeposit);
    expect(result).toBeFalsy();
  });

  it('Should have a check digit for 85660000001-7 01510024720-2 00247591920-1 00220021353-2', async () => {
    const mod = await cGetMod(barcodeInsuranceWithoutDigit);
    const resultFirst = await calcheckDigit(
      barcodeInsuranceWithoutDigit.substring(0),
      mod
    );
    expect(resultFirst).toEqual(7);

    const resultSecond = await calcheckDigit(
      barcodeInsuranceWithoutDigit.substring(11, 22),
      mod
    );
    expect(resultSecond).toEqual(2);

    const resultThird = await calcheckDigit(
      barcodeInsuranceWithoutDigit.substring(22, 33),
      mod
    );
    expect(resultThird).toEqual(1);

    const resultFourth = await calcheckDigit(
      barcodeInsuranceWithoutDigit.substring(33, 44),
      mod
    );
    expect(resultFourth).toEqual(2);
  });

  it('Should have a check digit for 85860000001-2 21220385213-0 54071621350-9 96839813294-8', async () => {
    const mod = await cGetMod(barcodeInsuranceWithoutDigit2);
    const resultFirst = await calcheckDigit(
      barcodeInsuranceWithoutDigit2.substring(0, 11),
      mod
    );
    expect(resultFirst).toEqual(2);

    const resultSecond = await calcheckDigit(
      barcodeInsuranceWithoutDigit2.substring(11, 22),
      mod
    );
    expect(resultSecond).toEqual(0);

    const resultThird = await calcheckDigit(
      barcodeInsuranceWithoutDigit2.substring(22, 33),
      mod
    );
    expect(resultThird).toEqual(9);

    const resultFourth = await calcheckDigit(
      barcodeInsuranceWithoutDigit2.substring(33, 44),
      mod
    );
    expect(resultFourth).toEqual(8);
  });

  it('Should have a check digit for 84630000000-7 29990296202-0 00410136000-7 000200644114-0', async () => {
    const mod = await cGetMod(barcodeInsuranceWithoutDigit3);
    const resultFirst = await calcheckDigit(
      barcodeInsuranceWithoutDigit3.substring(0, 11),
      mod
    );
    expect(resultFirst).toEqual(7);

    const resultSecond = await calcheckDigit(
      barcodeInsuranceWithoutDigit3.substring(11, 22),
      mod
    );
    expect(resultSecond).toEqual(0);

    const resultThird = await calcheckDigit(
      barcodeInsuranceWithoutDigit3.substring(22, 33),
      mod
    );
    expect(resultThird).toEqual(7);

    const resultFourth = await calcheckDigit(
      barcodeInsuranceWithoutDigit3.substring(33, 44),
      mod
    );
    expect(resultFourth).toEqual(0);
  });

  it('Should have a check digit for 83630000000-4 86170162000-2 00101020217-2 67028153602-9', async () => {
    const mod = await cGetMod(barcodeInsuranceWithoutDigit4);
    const resultFirst = await calcheckDigit(
      barcodeInsuranceWithoutDigit4.substring(0, 11),
      mod
    );
    expect(resultFirst).toEqual(4);

    const resultSecond = await calcheckDigit(
      barcodeInsuranceWithoutDigit4.substring(11, 22),
      mod
    );
    expect(resultSecond).toEqual(2);

    const resultThird = await calcheckDigit(
      barcodeInsuranceWithoutDigit4.substring(22, 33),
      mod
    );
    expect(resultThird).toEqual(2);

    const resultFourth = await calcheckDigit(
      barcodeInsuranceWithoutDigit4.substring(33, 44),
      mod
    );
    expect(resultFourth).toEqual(9);
  });

  it('Should have a check digit for 83610000000-6 46000192000-4 00383905700-1 00082858680-0', async () => {
    const mod = await cGetMod(barcodeInsuranceWithoutDigit5);
    const resultFirst = await calcheckDigit(
      barcodeInsuranceWithoutDigit5.substring(0, 11),
      mod
    );
    expect(resultFirst).toEqual(6);

    const resultSecond = await calcheckDigit(
      barcodeInsuranceWithoutDigit5.substring(11, 22),
      mod
    );
    expect(resultSecond).toEqual(4);

    const resultThird = await calcheckDigit(
      barcodeInsuranceWithoutDigit5.substring(22, 33),
      mod
    );
    expect(resultThird).toEqual(1);

    const resultFourth = await calcheckDigit(
      barcodeInsuranceWithoutDigit5.substring(33, 44),
      mod
    );
    expect(resultFourth).toEqual(0);
  });
});
