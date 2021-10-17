import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Home() {
  const checkIfWalletIsConnected = () => {
    /*
    * First make sure we have access to window.ethereum
    */
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
  };

  /*
* This runs our function when the page loads.
*/
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

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

        <button className="w-32 p-2 mx-auto mt-4 border-2 border-gray-500 rounded-md" onClick={wave}>
          Wave at Me
        </button>
      </main>
    </div>
  );
}
