import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import CustomerLocationMap from '../../components/CustomerLocationMap';

const DeliveryOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const watchIdRef = useRef(null);
  const locationUpdateIntervalRef = useRef(null);

  useEffect(() => {
    fetchOrders();
    fetchDeliveryBoyLocation();

    // Cleanup on unmount
    return () => {
      stopLocationTracking();
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/delivery-boy/orders');
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      const errorMessage = error.response?.data?.message || 'Failed to load orders';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryBoyLocation = async () => {
    try {
      const res = await axios.get('/delivery-boy/location');
      setDeliveryBoyLocation(res.data);
    } catch (error) {
      // Location not found is OK (first time)
      if (error.response?.status !== 404) {
        console.error('Error fetching delivery boy location:', error);
      }
    }
  };

  const updateLocationOnServer = async (position) => {
    try {
      const { latitude, longitude, heading, speed, accuracy } = position.coords || position;
      
      const res = await axios.post('/delivery-boy/location', {
        lat: latitude,
        lng: longitude,
        heading: heading || null,
        speed: speed ? (speed * 3.6) : null, // Convert m/s to km/h
        accuracy: accuracy || null
      });
      
      setDeliveryBoyLocation(res.data);
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsTracking(true);
    toast.success('Location tracking started');

    // Watch position for real-time updates
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        updateLocationOnServer(position);
      },
      (error) => {
        console.error('Geolocation error:', error);
        if (error.code === 1) {
          toast.error('Location access denied. Please enable location permissions.');
        } else {
          toast.error('Error getting location');
        }
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );

    // Also update location every 10 seconds as backup
    locationUpdateIntervalRef.current = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateLocationOnServer(position);
        },
        (error) => {
          console.error('Geolocation error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000
        }
      );
    }, 10000);
  };

  const stopLocationTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (locationUpdateIntervalRef.current !== null) {
      clearInterval(locationUpdateIntervalRef.current);
      locationUpdateIntervalRef.current = null;
    }
    setIsTracking(false);
    toast.success('Location tracking stopped');
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(`/delivery-boy/orders/${orderId}/status`, { orderStatus: status });
      toast.success('Status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      'Assigned to Delivery Boy': 'Picked Up',
      'Picked Up': 'Out for Delivery',
      'Out for Delivery': 'Delivered'
    };
    return statusFlow[currentStatus];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <span className="ml-4 text-gray-600">Loading orders...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assigned Orders</h1>
        <button
          onClick={isTracking ? stopLocationTracking : startLocationTracking}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            isTracking
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isTracking ? '🛑 Stop Tracking' : '📍 Start Location Tracking'}
        </button>
      </div>

      {isTracking && deliveryBoyLocation && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            📍 <strong>Tracking Active:</strong> Your location is being shared in real-time
            {deliveryBoyLocation.speed && ` • Speed: ${Math.round(deliveryBoyLocation.speed)} km/h`}
          </p>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">No orders assigned</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const nextStatus = getNextStatus(order.orderStatus);
            const address = order.addressId;

            return (
              <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Status: <span className="font-medium">{order.orderStatus}</span>
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                    ₹{order.total}
                  </span>
                </div>

                {order.userId && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Customer Details</h4>
                    <p className="text-sm">{order.userId.name}</p>
                    <div className="flex gap-2 mt-2">
                      <a
                        href={`tel:${order.userId.mobileNumber}`}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                      >
                        📞 Call Customer
                      </a>
                    </div>
                  </div>
                )}

                {address && (
                  <>
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Delivery Address</h4>
                      <p className="text-sm">
                        {address.fullName}, {address.mobileNumber}
                      </p>
                      <p className="text-sm">
                        {address.houseNo}, {address.street}
                      </p>
                      <p className="text-sm">
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                      {address.location && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${address.location.lat},${address.location.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                        >
                          🗺️ Open in Google Maps
                        </a>
                      )}
                    </div>
                    
                    {/* Google Maps Integration with Real-time Tracking */}
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">
                        Live Tracking Map
                        {deliveryBoyLocation && (
                          <span className="ml-2 text-sm font-normal text-green-600">
                            • Real-time tracking active
                          </span>
                        )}
                      </h4>
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <CustomerLocationMap 
                          address={address} 
                          deliveryBoyLocation={deliveryBoyLocation}
                          height="500px"
                          showRoute={!!deliveryBoyLocation}
                        />
                      </div>
                      {!deliveryBoyLocation && (
                        <p className="text-xs text-gray-500 mt-2">
                          Click "Start Location Tracking" above to see your location on the map
                        </p>
                      )}
                    </div>
                  </>
                )}

                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Items</h4>
                  {order.items.map((item, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      {item.name} - {item.weight} x{item.quantity} {item.isEggless && '(Eggless)'}
                    </div>
                  ))}
                </div>

                {nextStatus && (
                  <button
                    onClick={() => updateStatus(order._id, nextStatus)}
                    className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Mark as {nextStatus}
                  </button>
                )}

                {order.orderStatus === 'Delivered' && (
                  <div className="text-center py-2 text-green-600 font-semibold">
                    ✓ Order Delivered
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DeliveryOrders;

