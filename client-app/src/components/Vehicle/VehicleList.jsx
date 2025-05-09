import React, { useEffect, useState } from 'react';
import VehicleCard from './VehicleCard';
import Loader from '../../Helpers/Loader';
import { showErrorToast } from '../../Helpers/Toaster';
import './VehicleList.css';
import api from '../../services/api';

function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await api.getVehicles();
        setVehicles(response);
      } catch (error) {
        console.error('Araçlar yüklenirken hata oluştu:', error);
        showErrorToast('Araçlar yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="page-wrapper">
      <div className="content-wrapper">
        <div className="vehicles-grid">
          {vehicles.map((vehicle) => (
            <div key={vehicle.vehicleId} className="vehicle-card-wrapper">
              <VehicleCard vehicle={vehicle} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VehicleList; 