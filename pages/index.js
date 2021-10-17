import { ethers } from 'ethers';
import Head from 'next/head';
import { useEffect, useState } from 'react';

import wavePortal from '../utils/WavePortal.json';

const contractAddress = "0xff94289e222E16D6a53371Efc59A13b6D5313770";

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [message, setMessage] = useState("");

  const contractABI = wavePortal.abi;

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      try {
        const { ethereum } = window;

        if (!ethereum) {
          console.log("Make sure you have metamask!");
          return;
        } else {
          console.log("We have the ethereum object", ethereum);
        }

        /*
        * Check if we're authorized to access the user's wallet
        */
        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          setCurrentAccount(account);
        } else {
          console.log("No authorized account found");
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await wavePortalContract.wave(message, { gasLimit: 300000 });
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /*
 * Create a method that gets all waves from your contract
 */
  const getAllWaves = async () => {
    const { ethereum } = window;

    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const waves = await wavePortalContract.getAllWaves();

        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        setAllWaves(wavesCleaned);

        /**
         * Listen in for emitter events!
         */
        wavePortalContract.on("NewWave", (address, timestamp, message) => {
          console.log("NewWave", address, timestamp, message);

          setAllWaves(prevState => [...prevState, {
            address,
            timestamp: new Date(timestamp * 1000),
            message: message
          }]);
        });
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentAccount) getAllWaves();
  }, [currentAccount]);

  return (
    <div className="flex justify-center mt-16 w-100">
      <Head>
        <title>WavePortal</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col justify-center max-w-xl m-32 w-100">
        <div className="text-4xl font-bold text-center">
          <span role="img" aria-label="wave">👋</span> Hey there!
        </div>

        <div className="mt-4 text-center text-gray-600">
          I am Nacho, this is pretty cool! Connect your Ethereum wallet and wave at me!
        </div>

        {!currentAccount && <button className="w-32 p-2 mx-auto mt-4 border-2 border-gray-500 rounded-md" onClick={connectWallet}>
          Connect Wallet
        </button>}
        <input
          type="text"
          name="text"
          id="text"
          onChange={e => setMessage(e.target.value)}
          className="block px-4 py-2 mx-auto mt-4 border-2 border-gray-300 rounded-md shadow-sm w-52 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <button className="p-2 mx-auto mt-4 border-2 border-gray-500 rounded-md w-52" onClick={wave}>
          Post a message!
        </button>

        {[...allWaves].reverse().map(({ address, timestamp, message }) => <div key={message + timestamp} className="p-2 mt-4">
          <div>Address: {address}</div>
          <div>Time: {timestamp.toString()}</div>
          <div>Message: {message}</div>
        </div>)}
      </main>
    </div>
  );
}
