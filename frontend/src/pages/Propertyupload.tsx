import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Amenity {
  id: number;
  name: string;
}

const PropertyUpload = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: 'residential',
    property_type: '1_bedroom',
    title: '',
    description: '',
    price: '',
    location: '',
    bedrooms: 1,
    bathrooms: 1,
    square_feet: '',
    furnished: false,
    pet_friendly: false,
    available_from: '',
  });

  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);

  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dynamic sub-types
  const residentialTypes = [
    { value: 'bedsitter', label: 'Bedsitter' },
    { value: 'studio', label: 'Studio' },
    { value: '1_bedroom', label: '1 Bedroom' },
    { value: '2_bedroom', label: '2 Bedroom' },
    { value: '3_bedroom', label: '3 Bedroom' },
    { value: '4_bedroom', label: '4+ Bedroom' },
    { value: 'house', label: 'Standalone House' },
  ];

  const businessTypes = [
    { value: 'godown', label: 'Godown' },
    { value: 'warehouse', label: 'Warehouse' },
    { value: 'shop', label: 'Shop / Retail Space' },
    { value: 'office', label: 'Office Space' },
    { value: 'mall', label: 'Mall / Shopping Complex' },
    { value: 'showroom', label: 'Showroom' },
    { value: 'other_commercial', label: 'Other Commercial' },
  ];

  const currentTypes = formData.category === 'residential' ? residentialTypes : businessTypes;

  // Fetch Amenities from Backend
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/properties/amenities/');
        setAmenities(res.data);
      } catch (err) {
        console.error('Failed to fetch amenities:', err);
      }
    };

    fetchAmenities();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAmenityChange = (amenityId: number) => {
    setSelectedAmenities(prev =>
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(prev => [...prev, ...files]);
      const previews = files.map(file => URL.createObjectURL(file));
      setPreviewImages(prev => [...prev, ...previews]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const data = new FormData();

    // Append basic fields
    Object.keys(formData).forEach(key => {
      data.append(key, String(formData[key as keyof typeof formData]));
    });

    // Append selected amenities
    selectedAmenities.forEach(id => {
      data.append('amenities', id.toString());
    });

    // Append images
    images.forEach(image => {
      data.append('images', image);
    });

    try {
      await axios.post('http://127.0.0.1:8000/api/properties/create/', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      setSuccess("Property listed successfully!");
      setTimeout(() => navigate('/landlord/dashboard'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to upload property");
      console.error(err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">List New Property</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Category & Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Property Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full p-4 border rounded-xl">
              <option value="residential">Residential</option>
              <option value="business">Business / Commercial</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Property Type</label>
            <select name="property_type" value={formData.property_type} onChange={handleChange} className="w-full p-4 border rounded-xl" required>
              {currentTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-4 border rounded-xl" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Monthly Price (KSh)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-4 border rounded-xl" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full p-4 border rounded-xl" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full p-4 border rounded-xl" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Available From</label>
          <input 
            type="date" 
            name="available_from" 
            value={formData.available_from} 
            onChange={handleChange} 
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-4 border border-gray-300 rounded-xl"
            required 
          />
        </div>

        {/* Amenities - Multi Select */}
        <div>
          <label className="block text-sm font-medium mb-3">Amenities (Select all that apply)</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {amenities.map(amenity => (
              <label key={amenity.id} className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(amenity.id)}
                  onChange={() => handleAmenityChange(amenity.id)}
                />
                <span>{amenity.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium mb-2">Upload Images</label>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full p-4 border rounded-xl" />
          <div className="flex gap-4 mt-4 flex-wrap">
            {previewImages.map((src, i) => (
              <img key={i} src={src} alt="preview" className="w-28 h-28 object-cover rounded-xl" />
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl text-lg font-semibold transition disabled:opacity-50"
        >
          {loading ? "Listing Property..." : "List Property"}
        </button>
      </form>
    </div>
  );
};

export default PropertyUpload;