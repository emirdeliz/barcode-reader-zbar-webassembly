/**
 * @jest-environment node
 */
import { getBilletPathAndBarcodeNumber } from '@/__mock__/helpers';
import { splitStringBySegmentLength } from '../string/StringHelper';
import { readBarcodeFromStack } from './BarcodeHelper';

jest.setTimeout(15000);

describe('helpers/barcode', () => {
	beforeAll(() => {
		jest.spyOn(globalThis.console, 'log').mockImplementation(() => undefined);
		jest.spyOn(globalThis.console, 'warn').mockImplementation(() => undefined);
		jest.spyOn(globalThis.console, 'error').mockImplementation(() => undefined);
	});

	const dataTest = getBilletPathAndBarcodeNumber().map((data) => {
		const filename = data.path.replace(/^.*[\\\/]/, '');
		return [filename, data.path, data.password, data.barcode];
	}) as Array<Array<string>>;

	test.each(dataTest)(
		'Should have a barcode from %s',
		async (_filename, path, password, expected) => {
			const result = await readBarcodeFromStack({ filePath: path, password });
			const isBarcodeOfInsurance = expected[0] === '8';
			if (isBarcodeOfInsurance) {
				const resultWithoutCheckDigit = splitStringBySegmentLength(
					result,
					2,
					10
				).join('');
				const barcodeWithoutCheckDigit = splitStringBySegmentLength(
					expected,
					2,
					10
				).join('');
				expect(resultWithoutCheckDigit).toEqual(barcodeWithoutCheckDigit);
			} else {
				expect(result).toEqual(expected);
			}
		}
	);
});
