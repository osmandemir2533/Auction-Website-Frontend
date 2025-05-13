import React, { useEffect, useState } from 'react';
import vehicleApi from '../../services/vehicleApi';
import Loader from '../../Helpers/Loader';
import CreateBid from './CreateBid';
import './Styles/bid.css';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useNavigate } from 'react-router-dom';

function BidsDetail({ vehicleId }) {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auctionStatus, setAuctionStatus] = useState(false);
  const [vehicle, setVehicle] = useState(null);
  const [hubConnection, setHubConnection] = useState(null);
  const navigate = useNavigate();

  // SignalR bağlantısını oluştur
  useEffect(() => {
    const createHubConnection = async () => {
      const connection = new HubConnectionBuilder()
        .withUrl("https://localhost:7282/BidUpdate/Hub")
        .configureLogging(LogLevel.Information)
        .build();

      try {
        await connection.start();
        console.log("SignalR Bağlantısı başarılı!");
        setHubConnection(connection);
      } catch (error) {
        console.error("SignalR Bağlantı hatası:", error);
      }
    };

    createHubConnection();

    return () => {
      if (hubConnection) {
        hubConnection.stop();
      }
    };
  }, [vehicleId]);

  // Mesaj dinleyicisini ayarla
  useEffect(() => {
    if (hubConnection) {
      // Önceki dinleyiciyi temizle
      hubConnection.off("messageReceived");

      // Yeni dinleyici ekle
      hubConnection.on("messageReceived", async (updatedBids) => {
        console.log("Yeni teklifler alındı:", updatedBids);
        try {
          // Sadece bu araç için olan teklifleri filtrele
          const vehicleBids = updatedBids.filter(bid => bid.vehicleId === parseInt(vehicleId));
          
          if (vehicleBids.length > 0) {
            // Her teklif için kullanıcı bilgilerini al
            const bidsWithUserDetails = await Promise.all(
              vehicleBids.map(async (bid) => {
                const userData = await vehicleApi.getUserById(bid.userId);
                return {
                  ...bid,
                  userDetails: userData.result
                };
              })
            );

            setBids(bidsWithUserDetails);
          }
        } catch (error) {
          console.error("Kullanıcı bilgileri alınırken hata:", error);
        }
      });
    }
  }, [hubConnection, vehicleId]);

  // İlk veri yüklemesi ve periyodik güncelleme
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bidsData, vehicleData] = await Promise.all([
          vehicleApi.getBidsByVehicle(vehicleId),
          vehicleApi.getVehicleById(vehicleId)
        ]);

        const bidsWithUserDetails = await Promise.all(
          bidsData.result.map(async (bid) => {
            const userData = await vehicleApi.getUserById(bid.userId);
            return {
              ...bid,
              userDetails: userData.result
            };
          })
        );

        setBids(bidsWithUserDetails);
        setVehicle(vehicleData.result);

        const token = localStorage.getItem('token');
        if (token) {
          const userData = JSON.parse(atob(token.split('.')[1]));
          const statusData = await vehicleApi.checkAuctionStatus({
            userId: userData.nameid,
            vehicleId: parseInt(vehicleId)
          });
          setAuctionStatus(statusData.isSuccess);
        }
      } catch (error) {
        console.error('Veri yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Periyodik güncelleme için interval
    const intervalId = setInterval(() => {
      if (hubConnection) {
        hubConnection.invoke("NewBid", parseInt(vehicleId))
          .catch(err => console.error("SignalR mesaj gönderme hatası:", err));
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [vehicleId, hubConnection]);

  const handleBidCheckout = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    navigate(`/vehicle/bidcheckout/${vehicleId}?amount=${vehicle?.auctionPrice}`);
  };

  const handleNewBid = (newBid) => {
    setBids(prevBids => {
      const updatedBids = [...prevBids, newBid];
      return updatedBids.sort((a, b) => b.bidAmount - a.bidAmount);
    });
  };

  if (loading) {
    return <Loader size="medium" />;
  }

  return (
    <>
      {auctionStatus ? (
        <div className="container mb-5">
          <CreateBid 
            vehicleId={parseInt(vehicleId)} 
            onNewBid={handleNewBid}
          />
        </div>
      ) : (
        <div className="container mb-5">
          <button 
            className="btn btn-warning" 
            type="button" 
            onClick={handleBidCheckout}
          >
            Ön Ödeme Yap ${vehicle?.auctionPrice}
          </button>
        </div>
      )}

      <div className="bid-list">
        <h2>Teklif Geçmişi</h2>
        {bids.map((bid, index) => (
          <div key={`${bid.id}-${index}`} className="mt-4">
            <div className="bid">
              <span className="bid-number">{index + 1}</span>
              <span className="bid-date">
                {new Date(bid.bidDate).toLocaleString()}
                {bid.userDetails && (
                  <span className="bid-user">
                    {bid.userDetails.fullName} ({bid.userDetails.email})
                  </span>
                )}
              </span>
              <span className="bid-amount">${bid.bidAmount}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default BidsDetail;