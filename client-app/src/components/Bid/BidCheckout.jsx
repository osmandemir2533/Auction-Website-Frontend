import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import vehicleApi from '../../services/vehicleApi';
import { showErrorToast } from '../../Helpers/Toaster';
import Loader from '../../Helpers/Loader';
import './Styles/bidCheckout.css';

function BidCheckout() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          showErrorToast("Lütfen önce giriş yapın.");
          navigate('/login');
          return;
        }

        const userData = JSON.parse(atob(token.split('.')[1]));
        const vehicleData = await vehicleApi.getVehicleById(vehicleId);
        
        setVehicle(vehicleData.result);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phoneNumber: userData.phoneNumber || ''
        });
      } catch (error) {
        console.error('Veri yüklenirken hata oluştu:', error);
        showErrorToast('Veri yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [vehicleId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showErrorToast("Lütfen önce giriş yapın.");
        navigate('/login');
        return;
      }

      const userData = JSON.parse(atob(token.split('.')[1]));
      console.log('Ödeme başlatılıyor:', {
        userId: userData.nameid,
        vehicleId: parseInt(vehicleId)
      });

      const result = await vehicleApi.doPayment({
        userId: userData.nameid,
        vehicleId: parseInt(vehicleId)
      });

      console.log('Ödeme başlatma sonucu:', result);

      if (result.success && result.clientSecret) {
        navigate('/Payment', {
          state: {
            apiResult: {
              clientSecret: result.clientSecret,
              stripePaymentIntentId: result.id,
              userId: userData.nameid,
              vehicleId: parseInt(vehicleId),
              amount: result.amount
            }
          }
        });
      } else {
        showErrorToast(result.message || "Ödeme başlatılamadı. Lütfen daha sonra tekrar deneyin.");
        setLoading(false);
      }
    } catch (error) {
      console.error('Ödeme başlatılırken hata oluştu:', error);
      showErrorToast("Ödeme başlatılırken bir hata oluştu.");
      setLoading(false);
    }
  };

  if (loading || !vehicle) {
    return <Loader />;
  }

  return (
    <div className='container'>
      <div className='card text-center'>
        <form onSubmit={handleSubmit}>
          <img 
            src={vehicle.image?.startsWith('http') 
              ? vehicle.image 
              : vehicle.image?.startsWith('data:image')
                ? vehicle.image
                : vehicle.image 
                  ? `https://localhost:7282/Images/${vehicle.image}`
                  : "https://via.placeholder.com/300x200?text=Resim+Yok"} 
            className='card-image' 
            alt={vehicle.brandAndModel} 
          />
          <div className='card-content text-center'>
            <h3 className='card-title'>{vehicle.brandAndModel}</h3>
            <p className='card-text'>
              <span className='text-black bold'>${vehicle.auctionPrice}</span>
            </p>
          </div>
          <div className='container'>
            <div className='form-group mt-3'>
              <span className='text-black'><strong>Name</strong></span>
              <input
                className="form-control"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
              />
            </div>
            <div className='form-group mt-3'>
              <span className='text-black'><strong>Email</strong></span>
              <input
                className="form-control"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>
            <div className='form-group mt-3'>
              <span className='text-black'><strong>Phone Number</strong></span>
              <input
                className="form-control"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="Enter your phone number"
              />
            </div>
          </div>
          <div className='card-footer'>
            <button type="submit" className="btn btn-lg btn-success form-control mt-3" disabled={loading}>
              {loading ? <Loader /> : "Pay Auction Price"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BidCheckout; 