import React, { useState } from "react"
import { Modal, Input, useNotification } from "web3uikit"
import { useWeb3Contract } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import { ethers } from "ethers"
function UpdateNFTListingModal({ nftAddress, tokenId, isVisible, marketplaceAddress, onClose }) {
    const [updatedPriceListing, setUpdatedPriceListing] = useState(0)

    const dispatch = useNotification()

    const { runContractFunction: updateListing } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "updateListing",
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
            newPrice: ethers.utils.parseEther(updatedPriceListing || "0"),
        },
    })

    const handleUpdateListingSuccess = async () => {
        dispatch({
            type: "success",
            message: "Listing updated!",
            title: "Listing is updated, please refresh",
            position: "topR",
        })
        onClose && onClose()
        setUpdatedPriceListing("0")
    }

    return (
        <Modal
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={() => {
                updateListing({
                    onError: (error) => console.log(error.message),
                    onSuccess: handleUpdateListingSuccess,
                })
            }}
        >
            <Input
                label="Update listing price ETH"
                name="New Listing Price"
                type="number"
                onChange={(e) => setUpdatedPriceListing(e.target.value)}
                value={updatedPriceListing}
            />
        </Modal>
    )
}

export default UpdateNFTListingModal
