import React from 'react';
import NavBar from './components/NavBar';
import { Routes, Route } from "react-router-dom";

import HomePage from './pages/HomePage';
import MarketPage from './pages/MarketPage';
import MyMarketPage from './pages/MyMarketPage';

class App extends React.Component {
  render() {
    return (
      <div id='conatiner'> 
        <NavBar
          tabs={['Home', 'Market', 'My EVMOS']} 
          links={['/', '/market', '/mymarket']} />
        <div className="container" style={{height: "100%"}}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/market" element={<MarketPage />} />
            <Route path="/mymarket" element={<MyMarketPage />} />
          </Routes>
        </div>
      </div>
    );
  }
}

export default App;
