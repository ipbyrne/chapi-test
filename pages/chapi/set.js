/* eslint-disable @next/next/no-sync-scripts */
import Head from "next/head";
import React, { useEffect, useState } from "react";

const ChapiSet = () => {
  const [chapiState, setChapiState] = useState({});
  useEffect(() => {
    (async () => {
      const { WebCredentialHandler } = window;
      const event = await WebCredentialHandler.receiveCredentialEvent();
      setChapiState({ event });
    })();
  }, []);
  const handleStoreCredential = () => {
    const {
      event: {
        credential: { data },
      },
    } = chapiState;
    console.log("Data stored in wallet", data);
    chapiState.event.respondWith(
      new Promise((resolve) => {
        return data
          ? resolve({ dataType: "VerifiablePresentation", data })
          : resolve(null);
      })
    );
  };
  return (
    <>
      <Head>
        <title>{"CHAPI SET"}</title>
        <link rel="icon" href="/favicon.ico" />
        <script src="https://unpkg.com/credential-handler-polyfill@2.1.0/dist/credential-handler-polyfill.min.js"></script>
        <script src="https://unpkg.com/web-credential-handler@2.0.0/dist/web-credential-handler.min.js"></script>
      </Head>
      <div>
        <div sx={{ mt: 8 }}>
          <button onClick={handleStoreCredential}>
            Save Credentials
          </button>
          <pre>{JSON.stringify(chapiState, null, 2)}</pre>
        </div>
      </div>
    </>
  );
};

export default ChapiSet;