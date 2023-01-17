import { scanBarcodeAndIgnorePix } from '@/barcode';

export let wasmPathGlobal = '';

interface ReadBarcodeProps {
	file?: File;
	filePath?: string;
	wasmPath?: string;
	scale?: number;
	sequenceNum?: number;
	password?: string;
	onRequiredPassword?: () => Promise<string>;
}

const SCALE_START = 3;
const RETRY_INTERVAL = 300;

let hasBarcodeProcessing = false;
export const readBarcodeFromStack = async (props: ReadBarcodeProps) => {
	wasmPathGlobal = props.wasmPath;
	return new Promise<string>((resolve, reject) => {
		setTimeout(async () => {
			if (hasBarcodeProcessing) {
				resolve(readBarcodeFromStack(props));
			} else {
				hasBarcodeProcessing = true;
				try {
					const result = await readBarCode(props);
					resolve(result);
				} catch (e) {
					reject(e);
				} finally {
					hasBarcodeProcessing = false;
				}
			}
		}, RETRY_INTERVAL);
	});
};

export const readBarCode = async (props: ReadBarcodeProps) => {
	const {
		file,
		filePath,
		scale = SCALE_START,
		sequenceNum = 0,
		password,
		onRequiredPassword,
	} = props;
	try {
		const result = await scanBarcodeAndIgnorePix(
			file || filePath,
			scale,
			sequenceNum,
			password
		);
		return result;
	} catch (e) {
		const isPasswordException = e.name === 'PasswordException';
		if (isPasswordException && onRequiredPassword) {
			const password = await onRequiredPassword();
			return readBarCode({ ...props, password });
		} else {
			throw e;
		}
	}
};
