import React, { useEffect, useState } from "react";
import '../CSS/Wallet.css';
import copyLogo from '../Images/copy.png'
import nextLogo from '../Images/next.jpg'
import closeLogo from '../Images/close.png';
import { useNavigate } from "react-router-dom";
import sendLogo from "../Images/send.png"



function Wallet() {

    const [Ammout, setAmount] = useState(null);

    const [tokenData, setTokenData] = useState([]);
    const [activityData, setActivityData] = useState([]);

    const [isTokensActive, setIsTokensActive] = useState(true);
    const [isActivityActive, setIsActivityActive] = useState(false);
    const [isTransferring, setIsTransferring] = useState(false);

    const [formData, setFormData] = useState({
        receiver: '',
        amount: ''
    });


    const navigate = useNavigate();

    useEffect(() => {
        const tokenStoredData = localStorage.getItem("TokenDetails");

        if (tokenStoredData) {
            const dataArray = JSON.parse(tokenStoredData);
            setTokenData(dataArray);

            console.log(tokenData);
        }

        let address = RetrieveAccountFromLocalStorage();
        let rpc = RetrieveRPCFromLocalStorage();

        fetch(`https://f0f9-182-156-224-114.ngrok-free.app/mainToken/balance?RPC=${rpc}&address=${address}`, {
            method: 'POST',
            headers: new Headers({
                "ngrok-skip-browser-warning": "69420",
            })
        }).then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log(response);
            return response.json();
        })
            .then(data => {
                let balance = parseFloat(data.balance);
                balance = balance.toFixed(2);
                setAmount(balance);

                console.log(balance);
            }).catch(error => {
                console.error('Error during fetch:', error);

            });

        const userAddress = RetrieveAccountFromLocalStorage();

        // fetch(`https://f0f9-182-156-224-114.ngrok-free.app/notifications/?userAddress=${userAddress}`).then(response => {
        //     if (!response.ok) {
        //       throw new Error(`HTTP error! Status: ${response.status}`);
        //     }
        //     console.log(response.json());

        //     return response.json();
        // })
        //     .then(data => {
        //          console.log("this");

        //         console.log(data);
        //         setActivityData(data.result)
        //     }).catch(error => {
        //         console.error('Error during fetch:', error);
        //         // Handle the error appropriately (e.g., show a message to the user)
        //       });

        var responseClone;


        fetch(`https://f0f9-182-156-224-114.ngrok-free.app/notifications/?userAddress=${userAddress}`, {
            headers: new Headers({
                "ngrok-skip-browser-warning": "69420",
            })
        }).then(function (response) {
            responseClone = response.clone(); // 2
            return response.json();
        })
            .then(function (data) {
                console.log("this");

                console.log(data);
                setActivityData(data.result)
            }, function (rejectionReason) { // 3
                console.log('Error parsing JSON from response:', rejectionReason, responseClone); // 4
                responseClone.text() // 5
                    .then(function (bodyText) {
                        console.log('Received the following instead of valid JSON:', bodyText); // 6
                    });
            });

    }, [])








    function ImportToken() {
        navigate("/import-token")
    }

    const TokenWindow = (index) => {
        localStorage.setItem('Index', index);
        navigate("/token-details")
    }

    function RetrieveAccountFromLocalStorage() {
        const Account = JSON.parse(localStorage.getItem('AccountDetails'));

        if (Account) {
            return (
                Account.Address
            )
        }
    }

    function RetrievePrivateKeyFromLocalStorage() {
        const Account = JSON.parse(localStorage.getItem('AccountDetails'));

        if (Account) {
            return (
                Account.PrivateKey
            )
        }
    }


    function RetrieveNetworkFromLocalStorage() {
        const Network = JSON.parse(localStorage.getItem('NetworkDetails'))

        if (Network) {
            return (
                Network.NetworkName
            )
        }
    }

    function RetrieveRPCFromLocalStorage() {
        const Network = JSON.parse(localStorage.getItem('NetworkDetails'))

        if (Network) {
            return (
                Network.RPC
            )
        }
    }

    function RetrieveSymbolFromLocalStorage() {
        const Network = JSON.parse(localStorage.getItem('NetworkDetails'))

        if (Network) {
            return (
                Network.Currency
            )
        }
    }

    function onCopy() {
        navigator.clipboard.writeText(RetrieveAccountFromLocalStorage())
            .then(() => {
                alert('Copied to clipboard!');
            })
            .catch(err => {
                console.error('Error copying to clipboard:', err);
            });
    }


    const handleTokensClick = () => {
        setIsActivityActive(false)
        setIsTokensActive(true);
    };

    const handleActivityClick = () => {
        setIsActivityActive(true)
        setIsTokensActive(false);
    };

    const SendToken = () => {
        setIsTransferring(true);
        setFormData({ receiver: '', amount: '' })

    }

    const closeTransfer = () => {
        const activityStoredData = localStorage.getItem("TransferDetails");

        if (activityStoredData) {
            const dataArray = JSON.parse(activityStoredData);
            setActivityData(dataArray);
        }

        setIsTransferring(false)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    const TransferToken = () => {
        let rpc = RetrieveRPCFromLocalStorage();
        let receiver = formData.receiver;
        let amount = formData.amount;
        let PrivateKey = RetrievePrivateKeyFromLocalStorage();

        fetch(`https://f0f9-182-156-224-114.ngrok-free.app/transfer/mainToken?RPC=${rpc}&Receiver=${receiver}&PrivateKey=${PrivateKey}&Amount=${amount}`, {
            method: 'POST'
        }).then(response => response.json())
            .then(data => {
                console.log(data);
                SaveTransferToLocal(data.TxHash, receiver, amount);
            });
    }

    const SaveTransferToLocal = (txHash, receiver, amount) => {

        const TransferDetails = {
            Receiver: receiver,
            Hash: txHash,
            Ammout: amount,
        }

        const existingData = JSON.parse(localStorage.getItem('TransferDetails')) || [];

        // Add the new form data to the existing data
        const newData = [...existingData, TransferDetails];

        // Store the updated data back in local storage
        localStorage.setItem('TransferDetails', JSON.stringify(newData));

        alert(`Transfer Successful`);
        closeTransfer()
    }

    return (
        <div>
            <div className={`overlay-background ${!isTransferring ? 'display-none' : ''}`}>

                <div className="Transfer-card ">
                    <button type="button" className="transfer-close-button" onClick={closeTransfer}><img src={closeLogo} alt="close" className="close" /></button>

                    <div className="transfer-details">
                        <form>
                            <div className="form-floating form-element">
                                <input
                                    id="receiver"
                                    type="text"
                                    name="receiver"
                                    value={formData.receiver}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                                <label for="address" placeholder="Contract Address">Receiver Address</label>
                            </div>

                            <div className="form-floating form-element">
                                <textarea
                                    id="amount"
                                    type="text"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    rows={10}
                                    className="form-control"
                                    required
                                />
                                <label for="abi" placeholder="Contract Abi">Amount </label>
                            </div>
                            <div className="transfer-submit-button">
                                <button type="button" className="transfer-form-submit" onClick={TransferToken}>Transfer</button>
                            </div>
                        </form>

                    </div>
                </div>

            </div>
            <div className="wallet-backcard">
                <div className="Network">
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            <RetrieveNetworkFromLocalStorage />
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li><a className="dropdown-item" href="/change-network">Change Network</a></li>
                        </ul>
                    </div>
                </div>
                <div className="Address d-flex">
                    <div className="number"><RetrieveAccountFromLocalStorage /></div>
                    <button type="button" className="copy d-flex" onClick={onCopy}>...<img src={copyLogo} alt="copy" className="copyImage" /></button>
                </div>
                <div className="balance">
                    <div className="value">{Ammout}</div>
                    <div className="symbol"><RetrieveSymbolFromLocalStorage /></div>
                </div>
                <div className="Transfer d-flex">
                    <button type="button" className="Send" onClick={SendToken}>Send<img src={sendLogo} alt="Send" className="send-image" /></button>
                </div>
                <hr />
                <div className="navigation d-flex">
                    <div className={`Tokens ${isTokensActive ? 'navigation-active' : ''}`} onClick={handleTokensClick}  >Tokens</div>
                    <div className={`Activity ${isActivityActive ? 'navigation-active' : ''}`} onClick={handleActivityClick}>Activity</div>
                </div>
                <div className={`ImportedTokens ${!isTokensActive ? 'display-none' : ''}`}>
                    <div>
                        {tokenData.map((token, index) => (
                            <div key={index} className="TokenInfo d-flex" onClick={() => TokenWindow(index)}>
                                <div>{token.Name}</div>
                                <div className="next-logo-div">{token.Symbol}
                                    <img className="next" src={nextLogo} alt="Next"></img>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`ActivityList ${!isActivityActive ? 'display-none' : ''}`}>
                    <div>
                        {activityData.map((activity, index) => (
                            <div key={index} className="Activity-Info d-flex" >
                                <div className="Activity-name">{activity.notification_msg}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="importToken">
                    <button type="button" className="import" onClick={ImportToken}>Import Token</button>
                </div>
            </div>
        </div>
    );
}

export default Wallet;
