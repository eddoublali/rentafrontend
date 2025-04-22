import { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Car, Users, CreditCard, AlertTriangle, CheckCircle, Activity, Clock, TrendingUp } from 'lucide-react';

// Dashboard component for car rental system
export default function HomePage() {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    availableVehicles: 0,
    totalClients: 0,
    activeReservations: 0,
    revenue: 0,
    pendingPayments: 0
  });

  // Mock data - would be replaced with API calls to your backend
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setStats({
        totalVehicles: 48,
        availableVehicles: 32,
        totalClients: 215,
        activeReservations: 19,
        revenue: 287500,
        pendingPayments: 42300
      });
    }, 500);
  }, []);

  // Mock revenue data by month
  const revenueData = [
    { name: 'Jan', revenue: 42000 },
    { name: 'Feb', revenue: 38000 },
    { name: 'Mar', revenue: 52000 },
    { name: 'Apr', revenue: 59000 },
    { name: 'May', revenue: 47000 },
    { name: 'Jun', revenue: 63000 },
    { name: 'Jul', revenue: 72500 },
    { name: 'Aug', revenue: 91000 },
    { name: 'Sep', revenue: 85000 },
    { name: 'Oct', revenue: 71000 }
  ];

  // Mock reservation category data
  const reservationData = [
    { name: 'CITADINE', value: 35 },
    { name: 'BERLINE', value: 25 },
    { name: 'SUV', value: 30 },
    { name: 'UTILITAIRE', value: 10 }
  ];

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Mock recent reservations
  const recentReservations = [
    { id: 1, client: 'Ahmed Benani', vehicle: 'Toyota Corolla', startDate: '2025-04-19', endDate: '2025-04-24', status: 'CONFIRMED' },
    { id: 2, client: 'Fatima Zahra', vehicle: 'Mercedes C200', startDate: '2025-04-20', endDate: '2025-04-27', status: 'PENDING' },
    { id: 3, client: 'Omar Alami', vehicle: 'Hyundai Tucson', startDate: '2025-04-21', endDate: '2025-04-23', status: 'CONFIRMED' },
    { id: 4, client: 'Samira Tazi', vehicle: 'Renault Clio', startDate: '2025-04-22', endDate: '2025-04-25', status: 'COMPLETED' }
  ];

  // Mock vehicles requiring maintenance
  const maintenanceVehicles = [
    { id: 1, model: 'Peugeot 208', type: 'Oil Change', dueDate: '2025-04-24' },
    { id: 2, model: 'Volkswagen Golf', type: 'Timing Belt', dueDate: '2025-04-26' },
    { id: 3, model: 'Dacia Duster', type: 'Technical Visit', dueDate: '2025-04-29' }
  ];

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="card bg-white shadow-md">
          <div className="card-body p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="card-title text-lg font-medium text-gray-700">Vehicles</h2>
                <p className="text-3xl font-bold text-gray-900">{stats.totalVehicles}</p>
                <p className="text-sm text-gray-500">{stats.availableVehicles} available</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Car size={24} className="text-blue-600" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="card bg-white shadow-md">
          <div className="card-body p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="card-title text-lg font-medium text-gray-700">Clients</h2>
                <p className="text-3xl font-bold text-gray-900">{stats.totalClients}</p>
                <p className="text-sm text-gray-500">Total registered</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Users size={24} className="text-green-600" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="card bg-white shadow-md">
          <div className="card-body p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="card-title text-lg font-medium text-gray-700">Reservations</h2>
                <p className="text-3xl font-bold text-gray-900">{stats.activeReservations}</p>
                <p className="text-sm text-gray-500">Active now</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Calendar size={24} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="card bg-white shadow-md">
          <div className="card-body p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="card-title text-lg font-medium text-gray-700">Revenue</h2>
                <p className="text-3xl font-bold text-gray-900">{stats.revenue.toLocaleString()} DH</p>
                <p className="text-sm text-gray-500">This month</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <TrendingUp size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="card bg-white shadow-md">
          <div className="card-body p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="card-title text-lg font-medium text-gray-700">Pending Payments</h2>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingPayments.toLocaleString()} DH</p>
                <p className="text-sm text-gray-500">To be collected</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <CreditCard size={24} className="text-red-600" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="card bg-white shadow-md">
          <div className="card-body p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="card-title text-lg font-medium text-gray-700">Infractions</h2>
                <p className="text-3xl font-bold text-gray-900">7</p>
                <p className="text-sm text-gray-500">Pending resolution</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <AlertTriangle size={24} className="text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="card bg-white shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">Monthly Revenue</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value.toLocaleString()} DH`, 'Revenue']} 
                />
                <Legend />
                <Bar dataKey="revenue" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reservation Distribution */}
        <div className="card bg-white shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">Reservation by Category</h2>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reservationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {reservationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reservations */}
        <div className="card bg-white shadow-md">
          <div className="card-body p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Activity className="mr-2 text-blue-600" size={20} />
              Recent Reservations
            </h2>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="text-left">Client</th>
                    <th className="text-left">Vehicle</th>
                    <th className="text-left">Dates</th>
                    <th className="text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReservations.map((res) => (
                    <tr key={res.id} className="border-b border-gray-200">
                      <td className="py-2">{res.client}</td>
                      <td className="py-2">{res.vehicle}</td>
                      <td className="py-2 text-sm">
                        {new Date(res.startDate).toLocaleDateString()} - {new Date(res.endDate).toLocaleDateString()}
                      </td>
                      <td className="py-2">
                        <span 
                          className={`inline-flex items-center px-2 py-1 text-xs rounded-full 
                            ${res.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 
                              res.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-blue-100 text-blue-800'}`}
                        >
                          {res.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-actions mt-4">
              <button className="btn btn-sm btn-outline">View All</button>
            </div>
          </div>
        </div>

        {/* Maintenance Alerts */}
        <div className="card bg-white shadow-md">
          <div className="card-body p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Clock className="mr-2 text-red-600" size={20} />
              Upcoming Maintenance
            </h2>
            <div className="space-y-4">
              {maintenanceVehicles.map(vehicle => (
                <div key={vehicle.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">{vehicle.model}</h3>
                    <p className="text-sm text-gray-600">{vehicle.type}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-orange-600 text-sm font-medium mr-2">
                      Due: {new Date(vehicle.dueDate).toLocaleDateString()}
                    </span>
                    <div className="badge badge-warning">Due Soon</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="card-actions mt-4">
              <button className="btn btn-sm btn-outline">View All Maintenance</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}