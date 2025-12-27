import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const PincodeCheck = ({ onCheckResult }) => {
  const [pincode, setPincode] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }

    setChecking(true);
    try {
      const res = await axios.post('/delivery-pincodes/check', { pincode });
      setResult(res.data);
      if (onCheckResult) {
        onCheckResult(res.data);
      }
      if (res.data.available) {
        toast.success('Delivery available for this pincode');
      } else {
        toast.error('Delivery not available for this pincode');
      }
    } catch (error) {
      toast.error('Error checking pincode');
      setResult(null);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleCheck} className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <input
            type="text"
            maxLength={6}
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter pincode to check delivery"
            className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-amber-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 text-amber-900 placeholder-gray-400"
          />
        </div>
        <button
          type="submit"
          disabled={checking || pincode.length !== 6}
          className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {checking ? 'Checking...' : 'Check'}
        </button>
      </form>
      {result && (
        <div className={`mt-3 text-sm ${result.available ? 'text-green-600' : 'text-red-600'}`}>
          {result.available ? '✅' : '❌'} {result.message}
        </div>
      )}
    </div>
  );
};

export default PincodeCheck;

