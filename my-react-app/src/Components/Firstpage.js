import React from "react";
import logo from '../Images/background-removebg-preview.png';
import '../CSS/Firstpage.css';
import { useNavigate } from "react-router-dom";

function Firstpage() {
  const navigate = useNavigate();

  function createAccount() {
    navigate("/create");
  }

  function ClearLocalStorage() {
    localStorage.clear()
  }

  function recoverAccount() {
    navigate("/recover-wallet")
  }

  return (
    <div>
      <ClearLocalStorage />
      <div className="backcard">
        <div className="top-align"><h2 className="center-align">Welcome, to your wallet</h2>
          <div className="logo center-align">
            <img src={logo} alt='Wallet' />
          </div>
          <div className="button-container">
            <button type='button' className="btn btn-primary set-button" onClick={createAccount}>Create new account</button><br />
            <button type='button' className="btn btn-primary set-button " onClick={recoverAccount}>Recover Account</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Firstpage;