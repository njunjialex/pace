import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { PlusCircle, Home, Users, TrendingUp, Eye, List } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import MyProperties from '../../pages/MyProperties';

interface DashboardStats {
  total_properties: number;
  available_properties: number;
  pending_applications: number;
  monthly_revenue: number;
}

const LandlordDashboard = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'properties'>('overview');
  const [stats, setStats] = useState<DashboardStats>({
    total_properties: 0,
    available_properties: 0,
    pending_applications: 0,
    monthly_revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [token]);

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/properties/dashboard-stats/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Landlord Dashboard">
      {/* Toggle Tabs */}
      <div className="flex border-b mb-8">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-8 py-4 font-medium flex items-center gap-2 ${
            activeTab === 'overview' 
              ? 'border-b-4 border-blue-600 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Home size={20} />
          Overview
        </button>

        <button
          onClick={() => setActiveTab('properties')}
          className={`px-8 py-4 font-medium flex items-center gap-2 ${
            activeTab === 'properties' 
              ? 'border-b-4 border-blue-600 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <List size={20} />
          My Properties
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'overview' ? (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Properties</p>
                  <p className="text-4xl font-bold mt-2">{stats.total_properties}</p>
                </div>
                <Home className="w-10 h-10 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Available Now</p>
                  <p className="text-4xl font-bold mt-2 text-green-600">{stats.available_properties}</p>
                </div>
                <Eye className="w-10 h-10 text-green-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Pending Applications</p>
                  <p className="text-4xl font-bold mt-2 text-amber-600">{stats.pending_applications}</p>
                </div>
                <Users className="w-10 h-10 text-amber-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Monthly Revenue</p>
                  <p className="text-4xl font-bold mt-2">KSh {stats.monthly_revenue.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Quick Action */}
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('properties')}
              className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold transition"
            >
              <List size={24} />
              View My Properties
            </button>

            <a
              href="/upload"
              className="flex items-center gap-3 border border-gray-300 hover:bg-gray-50 px-8 py-4 rounded-2xl font-medium transition"
            >
              <PlusCircle size={24} />
              List New Property
            </a>
          </div>
        </div>
      ) : (
        // My Properties Page
        <MyProperties />
      )}
    </DashboardLayout>
  );
};

export default LandlordDashboard;