import "../styles/globals.css"
import Head from "next/head"
import Header from "../components/Header"
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://api.studio.thegraph.com/query/38137/nft-marketplace/v0.0.7",
})

function MyApp({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <title>Gil's NFT Marketplace</title>
                <meta name="description" content="A minimalistic and simple NFT marketplace" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MoralisProvider initializeOnMount={false}>
                <ApolloProvider client={client}>
                    <NotificationProvider>
                        <Header />
                        <Component {...pageProps} />
                    </NotificationProvider>
                </ApolloProvider>
            </MoralisProvider>
        </div>
    )
}

export default MyApp
