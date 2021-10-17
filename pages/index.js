import Head from 'next/head';

export default function Home() {
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
