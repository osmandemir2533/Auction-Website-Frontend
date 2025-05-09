import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { showErrorToast } from '../../Helpers/Toaster';
import Loader from '../../Helpers/Loader';

// Stripe public key'inizi buraya ekleyin
const stripePromise = loadStripe('pk_test_51QneBOGfJSzeGT0I2e62LW6SFCpXSfo39u0z2i9mL5CoG3Zav8w6O4N3Uqh392935M29O01BkMvNKFCAkg7m2XhZ00JhvJfkTn');

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [apiResult, setApiResult] = useState(null);

  useEffect(() => {
    const checkPaymentData = async () => {
      try {
        if (!location.state?.apiResult) {
          showErrorToast("Ödeme bilgileri bulunamadı.");
          navigate('/');
          return;
        }

        const { clientSecret, stripePaymentIntentId, userId, vehicleId, amount } = location.state.apiResult;
        
        if (!clientSecret || !stripePaymentIntentId) {
          showErrorToast("Geçersiz ödeme bilgileri.");
          navigate('/');
          return;
        }

        setApiResult({
          clientSecret,
          stripePaymentIntentId,
          userId,
          vehicleId,
          amount
        });
      } catch (error) {
        console.error('Ödeme bilgileri kontrol edilirken hata:', error);
        showErrorToast("Ödeme bilgileri yüklenirken bir hata oluştu.");
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkPaymentData();
  }, [location, navigate]);

  if (loading) {
    return <Loader />;
  }

  if (!apiResult) {
    return null;
  }

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#0570de',
      colorBackground: '#ffffff',
      colorText: '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'Ideal Sans, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '4px'
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Ödeme</h3>
              <p className="text-center mb-4">
                Toplam Tutar: ${apiResult.amount / 100}
              </p>
              <Elements 
                stripe={stripePromise} 
                options={{
                  clientSecret: apiResult.clientSecret,
                  appearance
                }}
              >
                <CheckoutForm 
                  apiResult={apiResult}
                  onSuccess={() => {
                    showErrorToast("Ödeme başarıyla tamamlandı!");
                    navigate('/');
                  }}
                  onError={(error) => {
                    showErrorToast(error.message || "Ödeme işlemi başarısız oldu.");
                  }}
                />
              </Elements>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment; 