import { ethers } from "./ethers-5.2.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
connectButton.onclick = connect;
fundButton.onclick = fund;

// console.log(ethers);

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

async function fund() {
    const ethAmount = "7";
    if (typeof window.ethereum !== "undefined") {
        /*
        To send a transactions, we need 
        - provider / connection to the blockchain
        - signer / wallet / someone with some gas
        - contract that we are interacting with
            - ^ ABI & Address
         */

        // Web3Provider is an object in ethers that allows us to basically wrap around stuff like Metamask
        //  Web3Provider is really similar to that JSON RPC provider, which we use before, which is where we put in exactly that endpoint, our alchemy endpoint, or when we're working with Metamask, whatever endpoint that we have in our network section
        //  Web3Provider takes that HTTP endpoint and automatically sticks it in ethers for us.
        // So this line of code basically looks at our Metamask and goes to the HTTP endpoint inside the Metamask. That's going to be what we're going to use as our provider here.
        const provider = new ethers.providers.Web3Provider(
            window.ethereum,
            "any"
        );

        // returns whichever wallet connected to provider
        const signer = provider.getSigner();

        // Getting Contract
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            });
        } catch (error) {
            console.log(error.message);
        }
    }
}
