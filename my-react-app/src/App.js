import React from "react";
import Firstpage from "./Components/Firstpage";
import Create from "./Components/Create";
import Wallet from "./Components/Wallet";
import Token from "./Components/Importtoken";
import Tokenwindow from "./Components/Windowtoken";
import RecoverWallet from "./Components/Recover"
import ChangeNetwork from "./Components/ChangeNetwork";
import { Route,Routes } from "react-router-dom";

function App() {
  return (
    <switch>
    <Routes>
      <Route path = "/ReactWallet" element = {<Firstpage />}/>
      <Route path = "/create" element = {<Create />}/>
      <Route path="/wallet" element= {<Wallet />} />
      <Route path="/import-token" element= {<Token />} />
      <Route path="/token-details" element= {<Tokenwindow />} />
      <Route path="/recover-wallet" element = {<RecoverWallet/>} />
      <Route path="/change-network" element = {<ChangeNetwork/>} />
    </Routes>
    </switch>

  );
}
  
export default App;
