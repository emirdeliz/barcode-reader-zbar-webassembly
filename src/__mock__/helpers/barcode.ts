import path from 'path';

const getBilletFile = (fileName: string) => {
	const filePath = new URL(
		`file://${path.resolve(__dirname, '../assets', fileName)}`
	).href;
	return filePath;
};

export interface BarcodeTest {
	barcode: string;
	path: string;
	password?: string;
}

export const getBilletPathAndBarcodeNumber = () => {
	return [
		{
			barcode: '836300000004861701620002001010202172670281536029',
			path: getBilletFile('campelo.pdf'),
		},
		{
			barcode: '836300000004861701620002001010202172670281536029',
			path: getBilletFile('celesc.pdf'),
		},
		{
			barcode: '858600000012212203852130540716213509968398132948',
			path: getBilletFile('gps.pdf'),
		},
		{
			barcode: '856300000028986999123102122221023254885250100009',
			path: getBilletFile('detran.pdf'),
		},
		{
			barcode: '836100000006460001920004003839057001000828586800',
			path: getBilletFile('gasbras-super.pdf'),
		},
		{
			barcode: '846200000012000001622026205200860000002767195783',
			path: getBilletFile('net-black-and-white.pdf'),
		},
		{
			barcode: '23793875700000020003381260068823434000006330',
			path: getBilletFile('nubank.pdf'),
		},
		{
			barcode: '23793898100000051053381260000044855200005080',
			path: getBilletFile('contabilivre-barcode-second-page.pdf'),
		},
		{
			barcode: '00191899100000020000000003215837001008823817',
			path: getBilletFile('cora.pdf'),
		},
		{
			barcode: '00194899200000025000000003215837001008830717',
			path: getBilletFile('cora-duedate-on-weekend.pdf'),
		},
		{
			barcode: '856300000029986999123100122221023256885250100002',
			path: getBilletFile('detran.pdf'),
		},
		{
			barcode: '00191899100000020000000003215837001008823817',
			path: getBilletFile('password-cora.pdf'),
			password: 'Test@123',
		},
		{
			barcode: '856300000029986999123100122221023256885250100002',
			path: getBilletFile('password-detran.pdf'),
			password: '12345',
		},
		{
			barcode: '23793875700000020003381260068823434000006330',
			path: getBilletFile('password-nubank.pdf'),
			password: '!@#$%&*()_+',
		},
	] as Array<BarcodeTest>;
};

export const barcodeInsurance =
	'836200000005865801620002001010202172425049125098';

export const barcodeDeposit = '23793381286006800396512000063300187440000002001';

export const barcodeInsuranceWithDigit =
	'838600000050096000190009000801782309000343062712';

export const barcodeInsuranceWithoutDigit =
	'85660000001015100247200024759192000220021353';

export const barcodeInsuranceWithoutDigit2 =
	'85860000001212203852135407162135096839813294';

export const barcodeInsuranceWithoutDigit3 =
	'85820000000572503282035607082021053959190446';

export const barcodeInsuranceWithoutDigit4 =
	'83630000000861701620000010102021767028153602';

export const barcodeInsuranceWithoutDigit5 =
	'83610000000460001920000038390570000082858680';
