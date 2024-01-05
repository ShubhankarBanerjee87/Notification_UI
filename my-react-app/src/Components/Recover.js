import React, { useEffect, useState } from "react";
import "../CSS/Recover.css"
import Back from '../Images/87-875958_back-arrow-in-circle-symbol-removebg-preview.png'
import { useNavigate } from "react-router-dom";

function Recover() {

    const [formData, setFormData] = useState(Array(12).fill('')); // Initialize an array with 12 empty strings
    const [PassPhrase, setPassPhrase] = useState('');
    const handleChange = (id, value) => {
        const updatedFormData = [...formData];
        updatedFormData[id - 1] = value;
        setFormData(updatedFormData);
    }

    const navigate = useNavigate();

    function getBack() {
        navigate("/ReactWallet")
    }

    function getNext() {
        navigate("/wallet")
    }

    function Clear() {
        setFormData(Array(12).fill(''))
    }

    const RecoverAccount = () => {
        const isAnyFieldEmpty = formData.some(value => value === '');
        if (isAnyFieldEmpty) {
         alert("fill all the input boxes")
          return;
        }
            
        const combinedString = formData.join(' ');
        setPassPhrase(combinedString);
        
        { getAccount(combinedString) }
    }    

    function getAccount(passPhrase) {
        // const passPhrase = PassPhrase;
        console.log(passPhrase)
        const url = `https://f0f9-182-156-224-114.ngrok-free.app/account/mnemonic?Mnemonic=${passPhrase}`
        fetch(url, {
          method: 'POST'
        }).then(response => response.json())
          .then(data => {
            console.log(data);

            {SaveToLocalStorage(data.Mnemonic,data.PrivateKey,data.Address)}
          });
    
    }


    function SaveToLocalStorage(Phrase,Privatekey,Address) {
        const AccountDetails = {
            Mnemonic: Phrase,
            PrivateKey: Privatekey,
            Address: Address
        };

        console.log(AccountDetails)
        localStorage.setItem('AccountDetails', JSON.stringify(AccountDetails));
        { SaveRPCToLocalStorage() }
    }

    function SaveRPCToLocalStorage() {
        const NetworkDetails = {
            NetworkName: "Polygon Testnet",
            RPC: "https://polygon-mumbai.g.alchemy.com/v2/V--NXYR3pyB0jrTP1LRu9OTFXPcKb7TS",
            Currency: "MATIC"
        };
        localStorage.setItem('NetworkDetails', JSON.stringify(NetworkDetails));
        { getNext() }
    }


    return (
        <div className="create-backcard">
            <div><button type="button" className="create-backButton" onClick={getBack} ><img src={Back} alt="back" className="create-backButton" /></button></div>
            <div className="create-top-align"><h2 className="create-center-align">Recover Your Wallet</h2>
                <div className="your-passphrase">

                    <p>Please provide your passphrase in the sequential order that you recorded during account creation.</p>
                    <h6>Your passphrase</h6>
                </div>
                <div className="wrapper">
                        {Array.from({ length: 12 }, (_, index) => (
                            <div key={index}>
                                <input
                                    type="text"
                                    className="phrase-input"
                                    required
                                    id={index + 1}
                                    value={formData[index]}
                                    onChange={(e) => handleChange(index + 1, e.target.value)}
                                />
                            </div>
                        ))}
                </div>
                <div className="down-buttons">
                    <button type='button' className="btn btn-primary bttn" onClick={RecoverAccount} >Recover</button><br />
                    <button type='button' className="btn btn-primary bttn" onClick={Clear}>Clear</button>
                </div>

            </div>
        </div>
    );
}

export default Recover;