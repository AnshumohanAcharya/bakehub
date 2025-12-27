import axios from 'axios';

/**
 * Geocode an address to get latitude and longitude coordinates
 * @param {Object} addressData - Address object with houseNo, street, city, state, pincode
 * @returns {Promise<{lat: number, lng: number}>} Coordinates object
 */
export const geocodeAddress = async (addressData) => {
  try {
    const { houseNo = '', street = '', city = '', state = '', pincode = '' } = addressData;
    
    // Build the full address string
    const fullAddress = `${houseNo} ${street}, ${city}, ${state} ${pincode}`.trim().replace(/\s+/g, ' ');
    
    // Use Google Geocoding API
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.warn('Google Maps API key not configured, skipping geocoding');
      return null;
    }
    
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json`;
    const response = await axios.get(geocodeUrl, {
      params: {
        address: fullAddress,
        key: apiKey
      }
    });
    
    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng
      };
    } else if (response.data.status === 'ZERO_RESULTS') {
      console.warn(`No results found for address: ${fullAddress}`);
      return null;
    } else {
      console.error(`Geocoding error: ${response.data.status} for address: ${fullAddress}`);
      return null;
    }
  } catch (error) {
    console.error('Geocoding error:', error.message);
    return null;
  }
};

