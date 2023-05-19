import { ethers } from "./ethers-5.2.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

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

// shows the balance of the contract
async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(contractAddress);
        console.log(
            `Contract Balance is : ${ethers.utils.formatEther(balance)}`
        );
    }
}

// fund
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value;
    console.log(`Funding with ${ethAmount}`);
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
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        // returns whichever wallet connected to provider
        const signer = provider.getSigner();

        // Getting Contract
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            });
            // Listening for events and Completed Transactions
            // listen for the tx to be mined
            // listen for an event

            // after we create the transaction, we tell JS to wait for this thing to finish
            await listenForTransactionMine(transactionResponse, provider);
            console.log("Done!");
        } catch (error) {
            console.log(error.message);
        }
    }
}

// listen for the tx to be mined
function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`);
    return new Promise((resolve, reject) => {
        //listens to the event once
        //  once the transaction hash is found, then we call that arrow function, the promise only returns only when resolve or reject functions are called. here once we found the transactionReceipt we call the resolve()
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            );
            resolve();
        });
    });
}

async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        console.log("Withdrawing...");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
            const transactionResponse = await contract.withdraw();
            await listenForTransactionMine(transactionResponse, provider);
        } catch (error) {
            console.log(error.message);
        }
    }
}
