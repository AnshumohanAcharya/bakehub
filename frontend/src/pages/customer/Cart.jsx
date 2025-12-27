import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import PincodeCheck from '../../components/PincodeCheck';
import { useState } from 'react';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();
  const [pincodeAvailable, setPincodeAvailable] = useState(null);

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link
          to="/products"
          className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const subtotal = getTotal();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      <div className="mb-6">
        <PincodeCheck onCheckResult={setPincodeAvailable} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="p-4 border-b last:border-b-0 flex items-center gap-4"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    {item.weight} {item.isEggless && '• Eggless'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Delivery: {item.deliveryDate} {item.deliveryTime}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.weight, item.isEggless, item.quantity - 1)}
                      className="w-8 h-8 border rounded flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.weight, item.isEggless, item.quantity + 1)}
                      className="w-8 h-8 border rounded flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-semibold w-20 text-right">₹{item.price * item.quantity}</p>
                  <button
                    onClick={() => removeFromCart(item.productId, item.weight, item.isEggless)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{subtotal}</span>
              </div>
            </div>

            {!pincodeAvailable?.available && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                Please check delivery availability before checkout
              </div>
            )}

            <Link
              to="/checkout"
              className={`block w-full text-center px-6 py-3 rounded-lg font-semibold ${
                pincodeAvailable?.available
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={(e) => {
                if (!pincodeAvailable?.available) {
                  e.preventDefault();
                }
              }}
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

