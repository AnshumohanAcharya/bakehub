import { Link } from 'react-router-dom';

const Banner = ({ banner }) => {
  return (
    <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{banner.title}</h1>
        {banner.description && (
          <p className="text-lg mb-4">{banner.description}</p>
        )}
        {banner.couponCode && (
          <p className="text-xl mb-6">
            Use Code: <span className="font-bold">{banner.couponCode}</span>
          </p>
        )}
        <Link
          to="/products"
          className="inline-block px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          {banner.buttonText || 'Order Now'}
        </Link>
      </div>
    </div>
  );
};

export default Banner;

