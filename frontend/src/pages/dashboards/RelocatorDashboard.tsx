import DashboardLayout from '../../components/Layout/DashboardLayout';

const RelocatorDashboard = () => {
  return (
    <DashboardLayout title="Relocation Partner Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-2">Pending Requests</h3>
          <p className="text-4xl font-bold text-orange-600">4</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-2">Active Moves</h3>
          <p className="text-4xl font-bold text-blue-600">2</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-2">This Month Earnings</h3>
          <p className="text-4xl font-bold text-green-600">KSh 87,500</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RelocatorDashboard;