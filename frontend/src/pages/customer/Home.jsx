import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Banner from '../../components/Banner';
import CategoryCard from '../../components/CategoryCard';
import ProductCard from '../../components/ProductCard';
import PincodeCheck from '../../components/PincodeCheck';

const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `${BACKEND_URL}${imagePath}`;
};

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredImage, setFeaturedImage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, bestsellersRes, bannersRes] = await Promise.all([
        axios.get('/categories'),
        axios.get('/products/bestsellers'),
        axios.get('/banners')
      ]);

      setCategories(categoriesRes.data);
      setBestsellers(bestsellersRes.data);
      setBanners(bannersRes.data);
      
      // Use first bestseller image as featured image, or first banner image
      if (bestsellersRes.data.length > 0 && bestsellersRes.data[0].images && bestsellersRes.data[0].images.length > 0) {
        setFeaturedImage(getImageUrl(bestsellersRes.data[0].images[0]));
      } else if (bannersRes.data.length > 0 && bannersRes.data[0].image) {
        setFeaturedImage(getImageUrl(bannersRes.data[0].image));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-stone-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 rounded-lg shadow-sm border border-pink-100">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-amber-900">Freshly baked every morning</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-amber-900">Taste the </span>
                <span className="text-primary-500">Magic</span>
                <span className="text-amber-900"> in Every Bite</span>
              </h1>

              {/* Description */}
              <p className="text-lg text-amber-900/80 leading-relaxed">
                Premium handcrafted cakes, pastries, and artisanal breads delivered straight to your doorstep. Made with love and the finest ingredients.
              </p>

              {/* Pincode Check */}
              <div className="pt-2">
                <PincodeCheck />
              </div>
            </div>

            {/* Right Column - Featured Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                {featuredImage ? (
                  <img 
                    src={featuredImage} 
                    alt="Featured bakery product" 
                    className="w-full h-[400px] md:h-[500px] object-cover"
                  />
                ) : (
                  <div className="w-full h-[400px] md:h-[500px] bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center">
                    <span className="text-amber-700 text-lg">Featured Product</span>
                  </div>
                )}
                
                {/* Eggless Badge Overlay */}
                <div className="absolute bottom-6 left-6 bg-yellow-50/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg border border-yellow-200">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="font-bold text-gray-800 text-sm">100% Eggless</div>
                      <div className="text-xs text-gray-600">Options available</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banners */}
      {banners.length > 0 && (
        <div className="mb-8">
          {banners.map((banner) => (
            <Banner key={banner._id} banner={banner} />
          ))}
        </div>
      )}

      {/* Categories */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Shop by Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="container mx-auto px-4 py-8 bg-gray-50">
        <h2 className="text-2xl font-bold mb-6">Best Seller Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            to="/products"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            View All Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

