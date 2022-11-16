import React from "react"
import Image from "next/image"
import { Form, useNotification } from "web3uikit"
import { ethers } from "ethers"
import nftAbi from "../constants/BasicNft.json"
import marketplaceAbi from "../constants/NftMarketplace.json"
import { useMoralis, useWeb3Contract } from "react-moralis"
import networkMapping from "../constants/networkMapping.json"

function Home() {
    const { chainId } = useMoralis()
    const chainIdString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainIdString]["NftMarketplace"][0]
    const dispatch = useNotification()

    const { runContractFunction } = useWeb3Contract()

    const approveAndListNFT = async (data) => {
        console.log("Approving NFT to be listed...")
        const nftAddress = data.data[0].inputResult
        const tokenId = data.data[1].inputResult
        const price = ethers.utils.parseUnits(data.data[2].inputResult, "ether").toString()

        const approveOptions = {
            abi: nftAbi,
            contractAddress: nftAddress,
            functionName: "approve",
            params: {
                to: marketplaceAddress,
                tokenId: tokenId,
            },
        }

        await runContractFunction({
            params: approveOptions,
            onSuccess: () => handleApproveSuccess(nftAddress, tokenId, price),
            onError: (error) => console.log(error.message),
        })
    }

    const handleApproveSuccess = async (nftAddress, tokenId, price) => {
        console.log("It's approved! Now, let's list it!")
        const listOptions = {
            abi: marketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "listItem",
            params: {
                nftAddress: nftAddress,
                tokenId: tokenId,
                price: price,
            },
        }

        await runContractFunction({
            params: listOptions,
            onSuccess: () => handleListingSuccess(),
            onError: (error) => console.log(error.message),
        })
    }

    const handleListingSuccess = async () => {
        dispatch({
            type: "success",
            message: "NFT Listed!",
            title: "NFT Listed",
            position: "topR",
        })
    }

    return (
        <div className="p-4 m-4">
            <Form
                onSubmit={approveAndListNFT}
                data={[
                    {
                        name: "NFT Address",
                        type: "text",
                        placeholder: "NFT Address",
                        inputWidth: "40%",
                        value: "",
                        key: "nftAddress",
                    },
                    {
                        name: "Token ID",
                        type: "number",
                        value: "",
                        key: "tokenId",
                    },
                    {
                        name: "Price (In ETH)",
                        type: "number",
                        value: "",
                        key: "price",
                    },
                ]}
                title="Sell your NFT here!"
                id="Sell Form"
            />
        </div>
    )
}

export default Home
