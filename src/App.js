import React from 'react';
import NavBar from './components/NavBar';
import { Routes, Route,Outlet } from "react-router-dom";

import HomePage from './pages/HomePage';
import MarketPage from './pages/MarketPage';
import MyMarketPage from './pages/MyMarketPage';
import TokenPage from './pages/TokenPage';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id='conatiner'> 
        <NavBar
          tabs={['Home', 'Market', 'My EVMOS']} 
          links={['/', '/market', '/mymarket']} />
        <div className="container" style={{height: "100%"}}>
        <Outlet />
          <Routes>
            <Route path="/" element={<HomePage />}  exact={true} />
            <Route path="/market" element={<MarketPage />}  exact={true} />
            <Route path="/mymarket" element={<MyMarketPage />}  exact={true} />
            <Route path="/token/:tokenId" element={<TokenPage />} />
          </Routes>
        </div>
      </div>
    );
  }
}

export default App;
