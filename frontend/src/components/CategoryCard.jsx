import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/products?category=${encodeURIComponent(category.name)}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 text-center"
    >
      {category.image ? (
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-32 object-cover rounded-lg mb-4"
        />
      ) : (
        <div className="w-full h-32 bg-primary-100 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-4xl">🍰</span>
        </div>
      )}
      <h3 className="font-semibold text-gray-800">{category.name}</h3>
    </Link>
  );
};

export default CategoryCard;

