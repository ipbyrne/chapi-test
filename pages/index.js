/* eslint-disable @next/next/no-sync-scripts */
import styles from '../styles/Home.module.css'
import Head from 'next/head';
import React, { useState } from "react"; 

export default function Home() {
  const [walletLoaded, setWalletLoaded] = useState(false);
  const [presentationReceived, setPresentationReceived] = useState(false);
  const [credentialAdded, setCredentialAdded] = useState(false);
  const initalizeWallet = async () => {
    if (!window.__hasWallet) {
      console.log("invoke chapi wallet init");
      window.__hasWallet = true;
      const polyfill = await window.credentialHandlerPolyfill.load();
      const { CredentialManager } = polyfill;
      const result = await CredentialManager.requestPermission();
      if (result !== "granted") {
        alert("Failed to init wallet");
      } else {
        setWalletLoaded(true);
      }
    }
  }

  const chapiSet = async () => {
    const query = {
      web: {
        VerifiablePresentation: {
          query: [
            {
              type: "QueryByExample",
              credentialQuery: {
                reason:
                  "Please present a University Degree Credential for Jane Doe.",
                example: {
                  "@context": [
                    "https://w3id.org/credentials/v1",
                    "https://www.w3.org/2018/credentials/examples/v1",
                  ],
                  type: ["UniversityDegreeCredential"],
                  credentialSubject: {
                    id: "did:example:ebfeb1f712ebc6f1c276e12ec21",
                  },
                },
              },
            },
          ],
        },
      },
    };

    const presentationResponse = await navigator.credentials.get(
      query
    );

    if(presentationResponse) {
      console.log("Here are the presented credentials", presentationResponse);
      setPresentationReceived(true);
    }
  }

  const chapiGet = async () => {
    const polyfill = await window.credentialHandlerPolyfill.load();
    const { WebCredential } = polyfill;
    const credentialType = "VerifiablePresentation";
    const webCredentialWrapper = new WebCredential(
      credentialType,
      {
        "@context": [
          "https://www.w3.org/2018/credentials/v1"
        ],
        "id": "urn:uuid:d86abd58-24cd-448e-8267-dfa58c6f5ed8",
        "type": [
          "VerifiableCredential"
        ],
        "issuer": "did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn",
        "issuanceDate": "2010-01-01T19:23:24Z",
        "credentialSubject": {
          "id": "did:example:123"
        },
        "proof": {
          "type": "Ed25519Signature2018",
          "created": "2021-10-30T17:32:33Z",
          "verificationMethod": "did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn#z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn",
          "proofPurpose": "assertionMethod",
          "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..YSJ1frCj50u2ZU7m5FkK1pShjHUsuieL3-6L9XLhGiBU6HNGezd2f5HGRDAhXbHLQfXrmkdUIUGzvnR0ST--Dw"
        }
      }
    );
    const result = await navigator.credentials.store(webCredentialWrapper);
    if (result) {
      console.log("here is the stored credential", result);
      setCredentialAdded(true);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <script src="https://unpkg.com/credential-handler-polyfill@2.1.0/dist/credential-handler-polyfill.min.js"></script>
      </Head>
      <h1>Chapi</h1>
      <p>Use the button below to initialize your wallet.</p>
      <button disabled={walletLoaded} onClick={() => initalizeWallet()}>Init Wallet</button>
      <p>
        Use the button below to present credentials.
      </p>
      <button disabled={presentationReceived} onClick={() => chapiSet()}>
        Present Credentials
      </button>
      <p>Use the button below to add credentials to your wallet</p>
      <button disabled={credentialAdded} onClick={() => chapiGet()}>Add To Wallet</button>
    </div>
  )
}
