import React, { useEffect, useState } from "react";
import "../CSS/Create.css"
import Back from '../Images/87-875958_back-arrow-in-circle-symbol-removebg-preview.png'
import { useNavigate } from "react-router-dom";

function Create() {
  const [Phrase, setPhrase] = useState('');
  const [Privatekey, setPrivatekey] = useState('');
  const [Address, setAddress] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    console.log("here");
    fetch('https://f0f9-182-156-224-114.ngrok-free.app/createAccount', {
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420"
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setPhrase(data.Mnemonic);
        setPrivatekey(data.PrivateKey);
        setAddress(data.Address);
      });
  }, [])

  const arr = Phrase.split(' ');

  function getBack() {
    navigate("/ReactWallet")
  }

  function getNext() {
    navigate("/wallet")
  }

  function SaveToLocalStorage() {
    const AccountDetails = {
      Mnemonic: Phrase,
      PrivateKey: Privatekey,
      Address: Address
    };
    localStorage.setItem('AccountDetails', JSON.stringify(AccountDetails));
    SaveRPCToLocalStorage()
  }

  function SaveRPCToLocalStorage() {
    const NetworkDetails = {
      NetworkName: "Polygon Testnet",
      RPC: "https://polygon-mumbai.g.alchemy.com/v2/V--NXYR3pyB0jrTP1LRu9OTFXPcKb7TS",
      Currency: "MATIC"
    };
    localStorage.setItem('NetworkDetails', JSON.stringify(NetworkDetails));
    getNext()
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(Phrase)
      .then(() => {
        alert('Copied to clipboard!');
      })
      .catch(err => {
        console.error('Error copying to clipboard:', err);
      });
  }

  return (
    <div className="create-backcard">
      <div><button type="button" className="create-backButton" onClick={getBack} ><img src={Back} alt="back" className="create-backButton" /></button></div>
      <div className="create-top-align"><h2 className="create-center-align">Create new Wallet</h2>
        <div className="your-passphrase">

          <p>Please write your passphrase on a paper and store it in a safe place. You can recover your account using passphase.</p>
          <h6>Your passphrase</h6>
        </div>
        <div className="wrapper">
          {arr.map((item, index) => (
            <div key={index} className="phrase">{item}</div>
          ))}
        </div>
        <div className="down-buttons">
          <button type='button' className="btn btn-primary bttn" onClick={copyToClipboard} >Copy </button><br />
          <button type='button' className="btn btn-primary bttn" onClick={SaveToLocalStorage}>Next</button>
        </div>

      </div>
    </div>
  );
}

export default Create;