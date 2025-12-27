import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/orders/my-orders');
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Preparing': 'bg-blue-100 text-blue-800',
      'Assigned to Delivery Boy': 'bg-purple-100 text-purple-800',
      'Picked Up': 'bg-indigo-100 text-indigo-800',
      'Out for Delivery': 'bg-orange-100 text-orange-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No orders yet</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold">Order #{order._id.slice(-8).toUpperCase()}</h3>
                  <p className="text-sm text-gray-600">
                    Placed on {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </div>

              <div className="mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between py-2 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.weight} • Qty: {item.quantity} {item.isEggless && '• Eggless'}
                      </p>
                    </div>
                    <p className="font-semibold">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              {order.addressId && (
                <div className="mb-4 text-sm text-gray-600">
                  <p className="font-medium mb-1">Delivery Address:</p>
                  <p>
                    {order.addressId.fullName}, {order.addressId.mobileNumber}
                  </p>
                  <p>
                    {order.addressId.houseNo}, {order.addressId.street}, {order.addressId.city}, {order.addressId.state} - {order.addressId.pincode}
                  </p>
                </div>
              )}

              {order.deliveryBoyId && (
                <div className="mb-4 text-sm">
                  <p className="font-medium">Delivery Boy: {order.deliveryBoyId.name}</p>
                  <p className="text-gray-600">{order.deliveryBoyId.mobileNumber}</p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Payment: {order.paymentMethod}</p>
                  <p className="text-sm text-gray-600">
                    Delivery: {format(new Date(order.deliveryDate), 'MMM dd, yyyy')} {order.deliveryTime}
                  </p>
                </div>
                <p className="text-xl font-bold">₹{order.total}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

