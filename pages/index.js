import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState("");

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

  const wave = () => {

  };

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
          Wave at Me
        </button>}
      </main>
    </div>
  );
}
