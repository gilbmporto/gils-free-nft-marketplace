import React, { useState, useEffect } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import basicNftAbi from "../constants/BasicNft.json"
import Image from "next/image"
import { Card, useNotification } from "web3uikit"
import UpdateNFTListingModal from "./UpdateNFTListingModal"

const truncateStr = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr

    const separator = "..."
    const charsToShow = strLen - separator.length
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)
    return (
        fullStr.substring(0, frontChars) +
        separator +
        fullStr.substring(fullStr.length - backChars)
    )
}

function NFTBox({ price, nftAddress, tokenId, marketplaceAddress, seller }) {
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const [modalVisibility, setModalVisibility] = useState(false)
    const hideModal = () => setModalVisibility(false)
    const dispatch = useNotification()

    const { isWeb3Enabled, account } = useMoralis()

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: basicNftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    })

    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "buyItem",
        msgValue: price,
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
        },
    })

    const updateUI = async () => {
        const thisTokenURI = await getTokenURI()
        console.log(`The Token URI is ${thisTokenURI}}`)
        if (thisTokenURI) {
            // Here, we'll have to use a IPFS Gateway: A server that will return IPFS files from a "normal" URL
            const requestURL = thisTokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            const tokenURIResponse = await (await fetch(requestURL)).json()
            const imageURI = tokenURIResponse.image
            const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            setImageURI(imageURIURL)
            setTokenName(tokenURIResponse.name)
            setTokenDescription(tokenURIResponse.description)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleBuyItemSuccess = () => {
        dispatch({
            type: "success",
            message: "NFT was successfully bought",
            title: "Item Bought",
            position: "topR",
        })
    }

    const handleAttemptToBuy = () => {
        dispatch({
            type: "loading",
            message: "Await transaction to finish...",
            title: "Loading",
            position: "topR",
        })
    }

    const handleClick = () => {
        isOwnedByActualUser
            ? setModalVisibility(true)
            : buyItem({
                  onError: (error) => console.log(error.message),
                  onComplete: () => handleAttemptToBuy,
                  onSuccess: () => handleBuyItemSuccess,
              })
    }

    const isOwnedByActualUser = seller === account || seller === undefined
    const formattedSellerAddress = isOwnedByActualUser ? "You" : truncateStr(seller || "", 15)

    return (
        <div className="m-4 p-4">
            <div>
                <UpdateNFTListingModal
                    isVisible={modalVisibility}
                    tokenId={tokenId}
                    marketplaceAddress={marketplaceAddress}
                    nftAddress={nftAddress}
                    onClose={hideModal}
                />
                {imageURI ? (
                    <div>
                        <Card
                            title={tokenName}
                            description={tokenDescription}
                            onClick={handleClick}
                        >
                            <div className="p-2">
                                <div className="flex flex-col items-end gap-2">
                                    <div>#{tokenId}</div>
                                    <div className="italic text-sm">
                                        Owned by {formattedSellerAddress}
                                    </div>
                                    <Image
                                        loader={() => imageURI}
                                        src={imageURI}
                                        height="200"
                                        width="200"
                                    />
                                    <div className="font-bold">
                                        {ethers.utils.formatUnits(price, "ether")} ETH
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    )
}

export default NFTBox
