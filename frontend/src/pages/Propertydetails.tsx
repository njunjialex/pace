import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Calendar, Heart, Share2, Phone } from 'lucide-react';
import axios from 'axios';

interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  square_feet?: number;
  furnished: boolean;
  pet_friendly: boolean;
  available_from: string;
  amenities: string[];
  images: Array<{ id: number; image: string; is_main: boolean }>;
  landlord: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  };
}

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/properties/${id}/`);
        setProperty(res.data);
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) return <p className="text-center py-20 text-lg">Loading property details...</p>;
  if (!property) return <p className="text-center py-20 text-red-500">Property not found</p>;

  const mainImage = property.images?.[activeImage]?.image || '/placeholder-house.jpg';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/listings" className="text-3xl font-bold text-blue-600">Pace</Link>
          <Link to="/listings" className="text-gray-600 hover:text-blue-600">← Back to Listings</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Image Gallery */}
          <div>
            <div className="relative rounded-3xl overflow-hidden shadow-xl h-[500px]">
              <img 
                src={mainImage}
                alt={property.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-house.jpg';
                }}
              />
              <div className="absolute top-4 right-4 flex gap-3">
                <button 
                  onClick={() => setIsFavorited(!isFavorited)}
                  className="bg-white p-3 rounded-full shadow hover:bg-red-50 transition"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                </button>
                <button className="bg-white p-3 rounded-full shadow hover:bg-gray-50 transition">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Thumbnail Images */}
            {property.images && property.images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {property.images.map((img, index) => (
                  <img 
                    key={index}
                    src={img.image}
                    alt={`View ${index + 1}`}
                    onClick={() => setActiveImage(index)}
                    className={`w-24 h-20 object-cover rounded-xl cursor-pointer border-2 transition-all ${activeImage === index ? 'border-blue-600 scale-105' : 'border-transparent'}`}
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-house.jpg';
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Property Information */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
              <div className="flex items-center gap-2 mt-3 text-gray-600">
                <MapPin size={20} />
                <span className="text-lg">{property.location}</span>
              </div>
            </div>

            <div className="text-4xl font-bold text-blue-600">
              KSh {property.price.toLocaleString()} <span className="text-lg font-normal text-gray-500">/ month</span>
            </div>

            <div className="flex gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Bed className="text-blue-600" />
                <span>{property.bedrooms} Bedroom</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="text-blue-600" />
                <span>{property.bathrooms} Bathroom</span>
              </div>
              <div className="font-medium">{property.property_type}</div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Amenities</h3>
              <div className="flex flex-wrap gap-3">
                {property.amenities.map((amenity, index) => (
                  <span key={index} className="bg-blue-50 text-blue-700 px-5 py-2 rounded-full text-sm font-medium">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t flex flex-col sm:flex-row gap-4">
              <button 
                className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <Calendar size={20} />
                Request Viewing
              </button>

              <button className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-semibold hover:bg-green-700 transition">
                Apply Now
              </button>
            </div>

            <p className="text-center text-sm text-gray-500">
              Listed by {property.landlord.first_name} {property.landlord.last_name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;