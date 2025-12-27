import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const minPrice = product.weightOptions?.length > 0
    ? Math.min(...product.weightOptions.map(w => w.price))
    : product.price;

  return (
    <Link
      to={`/products/${product._id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
    >
      {product.images && product.images.length > 0 ? (
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-6xl">🍰</span>
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
        {product.category && (
          <p className="text-sm text-gray-500 mb-2">{product.category.name}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary-600">
            ₹{minPrice}
            {product.weightOptions?.length > 1 && '+'}
          </span>
          {product.isEggless && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              Eggless
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

