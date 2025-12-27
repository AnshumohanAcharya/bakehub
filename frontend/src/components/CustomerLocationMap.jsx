import { useMemo, useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';

const CustomerLocationMap = ({ address, deliveryBoyLocation = null, height = '400px', showRoute = true }) => {
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey || '',
    libraries: ['places', 'geometry']
  });

  const mapContainerStyle = {
    width: '100%',
    height: height,
    borderRadius: '8px'
  };

  const center = useMemo(() => {
    // If both locations exist, center between them
    if (deliveryBoyLocation?.location?.lat && address?.location?.lat) {
      return {
        lat: (deliveryBoyLocation.location.lat + address.location.lat) / 2,
        lng: (deliveryBoyLocation.location.lng + address.location.lng) / 2
      };
    }
    // Otherwise center on customer location
    if (address?.location?.lat && address?.location?.lng) {
      return {
        lat: address.location.lat,
        lng: address.location.lng
      };
    }
    // Default center (Delhi, India)
    return {
      lat: 28.6139,
      lng: 77.2090
    };
  }, [address, deliveryBoyLocation]);

  // Calculate route between delivery boy and customer
  useEffect(() => {
    if (!isLoaded) return;
    
    if (showRoute && deliveryBoyLocation?.location && address?.location) {
      try {
        const directionsService = new window.google.maps.DirectionsService();
        
        directionsService.route(
          {
            origin: {
              lat: deliveryBoyLocation.location.lat,
              lng: deliveryBoyLocation.location.lng
            },
            destination: {
              lat: address.location.lat,
              lng: address.location.lng
            },
            travelMode: window.google.maps.TravelMode.DRIVING
          },
          (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              setDirectionsResponse(result);
            } else {
              console.error('Directions request failed:', status);
              setDirectionsResponse(null);
            }
          }
        );
      } catch (error) {
        console.error('Error creating directions service:', error);
        setDirectionsResponse(null);
      }
    } else {
      setDirectionsResponse(null);
    }
  }, [deliveryBoyLocation, address, showRoute, isLoaded]);

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: true,
    mapTypeControl: false,
    fullscreenControl: true
  };

  // Check if location data is available
  if (!address?.location?.lat || !address?.location?.lng) {
    return (
      <div className="flex items-center justify-center bg-gray-100 rounded-lg" style={{ height }}>
        <div className="text-center p-4">
          <p className="text-gray-500 mb-2">📍 Location data not available</p>
          <p className="text-sm text-gray-400">
            Please ensure the address has location coordinates
          </p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${address?.houseNo || ''} ${address?.street || ''}, ${address?.city || ''}, ${address?.state || ''} ${address?.pincode || ''}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            🗺️ Open in Google Maps
          </a>
        </div>
      </div>
    );
  }

  // Check if API key is missing
  if (!apiKey) {
    return (
      <div className="flex items-center justify-center bg-gray-100 rounded-lg" style={{ height }}>
        <div className="text-center p-4">
          <p className="text-gray-500 mb-2">🗺️ Google Maps API Key Required</p>
          <p className="text-sm text-gray-400 mb-3">
            Please configure VITE_GOOGLE_MAPS_API_KEY in your .env file
          </p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${address.location.lat},${address.location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            🗺️ Open in Google Maps
          </a>
        </div>
      </div>
    );
  }

  // Show loading state
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center bg-gray-100 rounded-lg" style={{ height }}>
        <div className="text-center p-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
          <p className="text-gray-600 font-medium">Loading map...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (loadError) {
    return (
      <div className="flex items-center justify-center bg-gray-100 rounded-lg" style={{ height }}>
        <div className="text-center p-4">
          <p className="text-gray-500 mb-2">⚠️ Map loading error</p>
          <p className="text-sm text-gray-400 mb-3">
            Unable to load Google Maps. Please check your API key.
          </p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${address.location.lat},${address.location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            🗺️ Open in Google Maps
          </a>
        </div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={deliveryBoyLocation?.location ? 13 : 15}
      options={mapOptions}
    >
          {/* Route between delivery boy and customer */}
          {directionsResponse && (
            <DirectionsRenderer
              directions={directionsResponse}
              options={{
                polylineOptions: {
                  strokeColor: '#3B82F6',
                  strokeWeight: 5,
                  strokeOpacity: 0.7
                },
                suppressMarkers: true
              }}
            />
          )}

          {/* Delivery Boy Location Marker */}
          {deliveryBoyLocation?.location && (
            <Marker
              position={{
                lat: deliveryBoyLocation.location.lat,
                lng: deliveryBoyLocation.location.lng
              }}
              title="Your Location (Delivery Boy)"
              label={{
                text: '🚴',
                className: 'delivery-boy-marker'
              }}
              onClick={() => setSelectedMarker('deliveryBoy')}
            >
              {selectedMarker === 'deliveryBoy' && (
                <InfoWindow onCloseClick={() => setSelectedMarker(null)}>
                  <div className="p-2">
                    <h3 className="font-semibold text-sm mb-1">Your Location</h3>
                    <p className="text-xs text-gray-600">
                      Delivery Boy
                    </p>
                    {deliveryBoyLocation.speed && (
                      <p className="text-xs text-gray-500">
                        Speed: {Math.round(deliveryBoyLocation.speed)} km/h
                      </p>
                    )}
                  </div>
                </InfoWindow>
              )}
            </Marker>
          )}

          {/* Customer Location Marker */}
          <Marker
            position={{
              lat: address.location.lat,
              lng: address.location.lng
            }}
            title="Customer Delivery Address"
            label={{
              text: '📍',
              className: 'customer-marker'
            }}
            onClick={() => setSelectedMarker('customer')}
          >
            {selectedMarker === 'customer' && (
              <InfoWindow onCloseClick={() => setSelectedMarker(null)}>
                <div className="p-2">
                  <h3 className="font-semibold text-sm mb-1">Delivery Address</h3>
                  <p className="text-xs text-gray-600">
                    {address.fullName}
                  </p>
                  <p className="text-xs text-gray-600">
                    {address.houseNo}, {address.street}
                  </p>
                  <p className="text-xs text-gray-600">
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${address.location.lat},${address.location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                  >
                    Get Directions →
                  </a>
                </div>
              </InfoWindow>
            )}
          </Marker>
    </GoogleMap>
  );
};

export default CustomerLocationMap;

