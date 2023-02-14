window.addEventListener('load', () => {
	const input = document.querySelector('input[type=file]');
	input.addEventListener('change', readBarcodeExample);
});

const onRequiredPassword = async () => {
	return new Promise((resolve) => {
		const password = prompt('Enter the pdf password');
		resolve(password);
	});
};

const readBarcodeExample = async (e) => {
	const barcodeResultContainer = document.querySelector(
		'.barcode-result-container'
	);
	barcodeResultContainer.innerHTML = 'Processing...';

	const file = e.target.files[0];
	try {
		const result = await BarcodeReader.readBarcodeFromStack({
			wasmPath: 'assets',
			file,
			onRequiredPassword,
		});
		barcodeResultContainer.innerHTML = `Result: ${result}`;
	} catch (e) {
		console.error(e.message);
		barcodeResultContainer.innerHTML = 'ERROR: ' + e;
	}
};
