import React, { useState } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import vehicleApi from '../../services/vehicleApi';
import Loader from '../../Helpers/Loader';
import './checkoutForm.css';

function CheckoutForm({ apiResult, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        apiResult.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardNumberElement),
            billing_details: {
              // Kullanıcı bilgileri eklenebilir
            }
          }
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        onError(stripeError);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Ödeme başarılı, ödeme geçmişini kaydet
        console.log('Ödeme geçmişi kaydediliyor:', {
          clientSecret: apiResult.clientSecret,
          stripePaymentIntentId: apiResult.stripePaymentIntentId,
          userId: apiResult.userId,
          vehicleId: apiResult.vehicleId
        });

        const historyResult = await vehicleApi.createPaymentHistory({
          clientSecret: apiResult.clientSecret,
          stripePaymentIntentId: apiResult.stripePaymentIntentId,
          userId: apiResult.userId,
          vehicleId: apiResult.vehicleId
        });

        console.log('Ödeme geçmişi sonucu:', historyResult);

        if (historyResult.isSuccess) {
          onSuccess();
        } else {
          const errorMessage = historyResult.errorMessages?.[0] || "Ödeme geçmişi kaydedilemedi.";
          setError(errorMessage);
          onError(new Error(errorMessage));
        }
      }
    } catch (err) {
      console.error('Ödeme işlemi sırasında hata:', err);
      setError(err.message || "Ödeme işlemi sırasında bir hata oluştu.");
      onError(err);
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '18px',
        color: '#32325d',
        backgroundColor: '#f7f7f7',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
    hidePostalCode: true // Zip kodu istemesin
  };

  return (
    <form onSubmit={handleSubmit} className="custom-payment-form">
      <div className="mb-4">
        <label className="form-label" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Kart Bilgileri</label>
        <div className="custom-card-element-wrapper">
          <div className="stripe-card-fields">
            <label className="stripe-label">Kart Numarası</label>
            <CardNumberElement className="stripe-input" options={cardElementOptions} />
            <div className="stripe-row">
              <div style={{ flex: 1 }}>
                <label className="stripe-label">Son Kullanma Tarihi</label>
                <CardExpiryElement className="stripe-input" options={cardElementOptions} />
              </div>
              <div style={{ flex: 1 }}>
                <label className="stripe-label">CVC</label>
                <CardCvcElement className="stripe-input" options={cardElementOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={!stripe || loading}
      >
        {loading ? <Loader /> : 'Ödemeyi Tamamla'}
      </button>
    </form>
  );
}

export default CheckoutForm; 