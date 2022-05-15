import '../styles/globals.css'
import type { AppProps } from 'next/app'

function BarcodeReader({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default BarcodeReader;
