import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [bids, setBids] = useState({
    item1: 100,
    item2: 200,
  });

  const handleBid = (item) => {
    setBids((prevBids) => ({
      ...prevBids,
      [item]: prevBids[item] + 10, // Her teklif +10 artırılıyor
    }));
  };

  return (
    <div className="auction-container">
      <h1>🛒 Açık Artırma Sitesi</h1>

      <div className="auction-item">
        <h2>📱 iPhone 15</h2>
        <p>Mevcut Teklif: <strong>${bids.item1}</strong></p>
        <button onClick={() => handleBid("item1")}>Teklif Ver</button>
      </div>

      <div className="auction-item">
        <h2>💻 MacBook Pro</h2>
        <p>Mevcut Teklif: <strong>${bids.item2}</strong></p>
        <button onClick={() => handleBid("item2")}>Teklif Ver</button>
      </div>
    </div>
  );
};

export default App;
