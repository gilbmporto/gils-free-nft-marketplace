import React, { useEffect } from "react"
import NFTBox from "../components/NFTBox"
import { useMoralis } from "react-moralis"
import networkMapping from "../constants/networkMapping.json"
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries"
import { useQuery } from "@apollo/client"

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString]["NftMarketplace"][0]

    const { loading, error, data } = useQuery(GET_ACTIVE_ITEMS)

    let awaitDataCollection = true
    let correctListedNfts
    async function awaitData() {
        await new Promise((resolve) => {
            if (data) {
                correctListedNfts = data.activeItems.filter(
                    (item) => item.buyer == "0x0000000000000000000000000000000000000000"
                )
                awaitDataCollection = false
                resolve()
            }
        })
    }

    awaitData()

    return (
        <div className="container mx-auto">
            <h1 className="py-4 mt-4 font-bold text-2xl">Recently Listed NFTs</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled ? (
                    loading || !data || awaitDataCollection ? (
                        <div>Loading...</div>
                    ) : (
                        correctListedNfts.map((nft) => {
                            const { price, nftAddress, tokenId, seller } = nft
                            return (
                                <NFTBox
                                    key={`${nftAddress}${tokenId}`}
                                    price={price}
                                    nftAddress={nftAddress}
                                    tokenId={tokenId}
                                    seller={seller}
                                    marketplaceAddress={marketplaceAddress}
                                />
                            )
                        })
                    )
                ) : (
                    <div>Web3 Not Enabled</div>
                )}
            </div>
        </div>
    )
}
