import { ethers } from "./ethers-5.2.esm.min.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
connectButton.onclick = connect;
fundButton.onclick = fund;

console.log(ethers);

async function connect() {
    // checks whether we have metamask in browser using window.ethereum
    if (typeof window.ethereum !== "undefined") {
        console.log("MetaMask is installed!");
        try {
            // Using "eth_requestAccounts" method to access a user's accounts.
            // requests user to provide an Ethereum address to identify
            await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            console.log("Connected!");
            connectButton.innerHTML = "Connected!";
        } catch (error) {
            console.log(error.message);
        }
    } else {
        console.log("Please install MetaMask!");
        connectButton.innerHTML = "Please install MetaMask!";
    }
}

async function fund(ethAmount) {
    console.log("Fund");
    if (typeof window.ethereum !== "undefined") {
        /*
        To send a transactions, we need 
        - provider / connection to the blockchain
        - signer / wallet / someone with some gas
        - contract that we are interacting with
            - ^ ABI & Address
         */
    }
}
