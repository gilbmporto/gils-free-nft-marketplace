import React from "react"
import { ConnectButton } from "web3uikit"
import Link from "next/link"

function Header() {
    return (
        <nav className="p-5 border-b-2 flex justify-between items-center w-full">
            <div className="flex flex-row align-middle items-center justify-between m-2">
                <Link href="/">
                    <h3 className="text-2xl mr-2 pr-2 md:mr-4 md:pr-6">Gil's NFT Marketplace</h3>
                </Link>
                <Link href="/sell-nft">
                    <p className="text-xl mr-2 pr-2 md:mr-4 md:pr-6">Sell NFT</p>
                </Link>
            </div>

            <ConnectButton moralisAuth={false} />
        </nav>
    )
}

export default Header
