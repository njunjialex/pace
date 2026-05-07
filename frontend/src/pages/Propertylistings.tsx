import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Users, Heart } from 'lucide-react';
import axios from 'axios';

interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  property_type: string;
  images: Array<{ id: number; image: string; is_main: boolean }>; // Updated interface
  amenities: Array<{ id: number; name: string }>;
  bedrooms: number;
  bathrooms: number;
}

const PropertyListings = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/properties/');
        setProperties(res.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const filteredProperties = properties
    .filter(property => 
      property.location.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedType === '' || property.property_type === selectedType)
    )
    .sort((a, b) => {
      if (sortBy === 'price_low') return a.price - b.price;
      if (sortBy === 'price_high') return b.price - a.price;
      return 0;
    });

  const propertyTypes = ['Bedsitter', '1 Bedroom', '2 Bedroom', '3 Bedroom', 'Studio'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-3xl font-bold text-blue-600">Pace</h1>
            
            <div className="hidden md:flex items-center gap-6 text-gray-700">
              <Link to="/" className="hover:text-blue-600 font-medium">Home</Link>
              <Link to="/listings" className="text-blue-600 font-medium">Listings</Link>
              <Link to="#" className="hover:text-blue-600 font-medium">For Landlords</Link>
              <Link to="#" className="hover:text-blue-600 font-medium">Relocation</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="px-5 py-2 text-gray-700 hover:text-blue-600 font-medium">
              Login
            </Link>
            <Link 
              to="/register"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Post a Property
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Find Your Perfect Home</h2>
          <p className="text-xl text-blue-100">Discover verified rental properties across Kenya</p>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-16 bg-white shadow-sm z-40 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[300px]">
              <input
                type="text"
                placeholder="Search by location (e.g. Westlands, Kilimani...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-5 py-3 border border-gray-300 rounded-lg focus:outline-none"
            >
              <option value="">All Types</option>
              {propertyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-5 py-3 border border-gray-300 rounded-lg focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>

            <div className="text-sm text-gray-500 ml-auto">
              {filteredProperties.length} properties found
            </div>
          </div>
        </div>
      </div>

      {/* Property Grid */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <p className="text-center text-gray-500 py-20">Loading properties...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => {
              const mainImage = property.images && property.images.length > 0 
                ? property.images[0].image 
                : '/placeholder-house.jpg';

              return (
                <div 
                  key={property.id}
                  className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition group"
                >
                  {/* Image */}
                  <div className="relative h-64">
                    <img 
                      src={mainImage}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-house.jpg';
                      }}
                    />
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-blue-600 shadow">
                      KSh {property.price.toLocaleString()}/mo
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-semibold text-lg line-clamp-2">{property.title}</h3>
                    
                    <div className="flex items-center gap-1 text-gray-500 mt-1">
                      <MapPin size={16} />
                      <span className="text-sm">{property.location}</span>
                    </div>

                    <div className="flex gap-4 mt-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Bed size={18} className="text-gray-600" />
                        <span>{property.bedrooms}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath size={18} className="text-gray-600" />
                        <span>{property.bathrooms}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={18} className="text-gray-600" />
                        <span>{property.property_type}</span>
                      </div>
                    </div>

                   {/* Amenities */}
                   <div className="flex flex-wrap gap-2 mt-4">
                     {property.amenities?.slice(0, 4).map((amenity) => (
                      <span 
                        key={amenity.id}                    // Better to use id as key
                        className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full"
                        >
                        {amenity.name}      
                      </span>
                      ))}
                    </div>

                    <Link 
                      to={`/property/${property.id}`}
                      className="block mt-6 text-center bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filteredProperties.length === 0 && (
          <p className="text-center text-gray-500 py-20 text-xl">
            No properties found matching your criteria.
          </p>
        )}
      </div>
    </div>
  );
};

export default PropertyListings;