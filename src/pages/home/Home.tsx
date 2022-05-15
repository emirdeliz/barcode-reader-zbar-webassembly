import type { NextPage } from 'next'
import Head from 'next/head'
import * as S from './Home.style';

export const Home: NextPage = () => {
  return (
		<>
			<Head>
				<S.Title>Barcode Reader with zbar and webassembly</S.Title>
				<meta
					name='description'
					content='Barcode Reader with zbar and webassembly'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<S.Main>
				<S.TitleSection>
					Try now
				</S.TitleSection>
				<S.InputUpload />
			</S.Main>
		</>
	);
}