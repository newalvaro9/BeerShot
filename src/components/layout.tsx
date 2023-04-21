import Head from 'next/head'
import Navbar from './navbar'

//Main page /...
export default function Layout({ children, title }: { children: React.ReactNode, title?: string }) {
    return (
        <>
            <Head>
                <title>{title ? title : "BeerShoot"}</title>
                <meta name="description" content="Upload your images and get a custom link to share it" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
            </Head>

            <Navbar />
            <div className='container-center-page'>
                {children}
            </div>
        </>
    )
}