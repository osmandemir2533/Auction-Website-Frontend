import React, { useEffect, useState } from 'react';
import vehicleApi from '../../services/vehicleApi';
import Loader from '../../Helpers/Loader';
import CreateBid from './CreateBid';
import './Styles/bid.css';

function BidsDetail({ vehicleId }) {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auctionStatus, setAuctionStatus] = useState(false);
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bidsData, vehicleData] = await Promise.all([
          vehicleApi.getBidsByVehicle(vehicleId),
          vehicleApi.getVehicleById(vehicleId)
        ]);

        // Her teklif için kullanıcı bilgilerini al
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

        // Kullanıcı giriş yapmışsa teklif durumunu kontrol et
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
  }, [vehicleId]);

  const handleBidCheckout = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    window.location.href = `/vehicle/bidcheckout/${vehicleId}?amount=${vehicle?.auctionPrice}`;
  };

  if (loading) {
    return <Loader size="medium" />;
  }

  return (
    <>
      {auctionStatus ? (
        <div className="container mb-5">
          <CreateBid vehicleId={parseInt(vehicleId)} />
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
        {bids
          .slice()
          .sort((a, b) => b.bidAmount - a.bidAmount)
          .map((bid, index) => (
            <div key={bid.id} className="mt-4">
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