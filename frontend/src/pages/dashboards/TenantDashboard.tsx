import DashboardLayout from '../../components/Layout/DashboardLayout';

const TenantDashboard = () => {
  return (
    <DashboardLayout title="Tenant Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-2">My Applications</h3>
          <p className="text-4xl font-bold text-blue-600">3</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-2">Favorites</h3>
          <p className="text-4xl font-bold text-blue-600">12</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-2">Upcoming Viewings</h3>
          <p className="text-4xl font-bold text-blue-600">2</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Recommended Properties</h3>
        <p className="text-gray-500">Property cards will go here...</p>
      </div>
    </DashboardLayout>
  );
};

export default TenantDashboard;