import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    houseNo: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    addressType: 'Home',
    isDefault: false
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await axios.get('/addresses');
      setAddresses(res.data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await axios.put(`/addresses/${editingAddress._id}`, formData);
        toast.success('Address updated');
      } else {
        await axios.post('/addresses', formData);
        toast.success('Address added');
      }
      fetchAddresses();
      resetForm();
    } catch (error) {
      toast.error('Failed to save address');
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      fullName: address.fullName,
      mobileNumber: address.mobileNumber,
      houseNo: address.houseNo,
      street: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      addressType: address.addressType,
      isDefault: address.isDefault
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    try {
      await axios.delete(`/addresses/${id}`);
      toast.success('Address deleted');
      fetchAddresses();
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      mobileNumber: '',
      houseNo: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      addressType: 'Home',
      isDefault: false
    });
    setEditingAddress(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Addresses</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          + Add New Address
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="tel"
                placeholder="Mobile Number"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                required
                className="px-4 py-2 border rounded-lg"
              />
            </div>
            <input
              type="text"
              placeholder="House/Flat No"
              value={formData.houseNo}
              onChange={(e) => setFormData({ ...formData, houseNo: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Street/Area"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
            <div className="grid grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Pincode"
                maxLength={6}
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                required
                className="px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="flex items-center gap-4">
              <select
                value={formData.addressType}
                onChange={(e) => setFormData({ ...formData, addressType: e.target.value })}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="mr-2"
                />
                Set as default
              </label>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                {editingAddress ? 'Update' : 'Save'} Address
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <div key={address._id} className="bg-white rounded-lg shadow-md p-6">
            {address.isDefault && (
              <span className="inline-block mb-2 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded">
                Default
              </span>
            )}
            <h3 className="font-semibold mb-2">{address.fullName}</h3>
            <p className="text-sm text-gray-600 mb-2">{address.mobileNumber}</p>
            <p className="text-sm text-gray-600 mb-2">
              {address.houseNo}, {address.street}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              {address.city}, {address.state} - {address.pincode}
            </p>
            <p className="text-xs text-gray-500 mb-4">{address.addressType}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(address)}
                className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(address._id)}
                className="px-4 py-2 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {addresses.length === 0 && !showForm && (
        <div className="text-center py-12">
          <p className="text-gray-500">No addresses saved</p>
        </div>
      )}
    </div>
  );
};

export default Addresses;

