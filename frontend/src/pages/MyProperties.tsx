import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Edit2, Trash2, Eye } from 'lucide-react';

interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  property_type: string;
  status: string;
  bedrooms: number;
  images: Array<{ image: string }>;
}

const MyProperties = () => {
  const { token } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'available' | 'rented'>('all');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/properties/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProperties(res.data);
    } catch (error) {
      console.error("Failed to fetch properties", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => {
    if (activeTab === 'available') return property.status === 'available';
    if (activeTab === 'rented') return property.status === 'rented';
    return true; // 'all'
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">My Properties</h2>
        <Link
          to="/landlord/upload-property"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition flex items-center gap-2"
        >
          + List New Property
        </Link>
      </div>

      {/* Toggle Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-6 py-3 font-medium ${activeTab === 'all' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          All Properties ({properties.length})
        </button>
        <button
          onClick={() => setActiveTab('available')}
          className={`px-6 py-3 font-medium ${activeTab === 'available' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          Available ({properties.filter(p => p.status === 'available').length})
        </button>
        <button
          onClick={() => setActiveTab('rented')}
          className={`px-6 py-3 font-medium ${activeTab === 'rented' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          Rented ({properties.filter(p => p.status === 'rented').length})
        </button>
      </div>

      {loading ? (
        <p>Loading your properties...</p>
      ) : filteredProperties.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No properties found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-2xl shadow overflow-hidden">
              <div className="h-52 bg-gray-200 relative">
                {property.images && property.images.length > 0 ? (
                  <img 
                    src={property.images[0].image} 
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-xs font-bold">
                  {property.status === 'available' ? 'Available' : 'Rented'}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-lg">{property.title}</h3>
                <p className="text-blue-600 font-medium mt-1">
                  KSh {property.price.toLocaleString()}/month
                </p>
                <p className="text-sm text-gray-500 mt-1">{property.location}</p>

                <div className="flex gap-4 mt-4 text-sm">
                  <span>{property.bedrooms} Beds</span>
                  <span>{property.property_type}</span>
                </div>

                <div className="flex gap-3 mt-6">
                  <button className="flex-1 border border-gray-300 py-3 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2">
                    <Eye size={18} /> View
                  </button>
                  <button className="flex-1 border border-gray-300 py-3 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2">
                    <Edit2 size={18} /> Edit
                  </button>
                  <button className="p-3 border border-red-200 text-red-600 rounded-xl hover:bg-red-50">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProperties;