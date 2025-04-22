import { useState, useEffect } from "react";
import {
  Activity,
  Clock,
  Car,
  Users,
  Calendar,
  TrendingUp,
  CreditCard,
  AlertTriangle,
} from "lucide-react";
import StatsCard from "./StatsCard";
import RevenueChart from "./RevenueChart";
import { useReservation } from "../../context/ReservationContext";
import { useVehicle } from "../../context/VehicleContext";
import { useClient } from "../../context/ClientContext";
import { useRevenue } from "../../context/RevenueContext";
import { useInfraction } from "../../context/InfractionContext";

export default function HomePagee() {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    availableVehicles: 0,
    totalClients: 0,
    activeReservations: 0,
    revenue: 0,
    pendingPayments: 0,
  });

  const { reservations, fetchReservations } = useReservation();
  const { vehicles } = useVehicle();
  const { clients, fetchClients } = useClient();
  const {
    revenues,
    fetchRevenues,
    monthlyRevenue,
    fetchMonthlyRevenue,
    loading: revenueLoading,
  } = useRevenue();
  const { infractions, fetchInfractions } = useInfraction();

  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    fetchClients();
    fetchReservations();
    fetchRevenues();
    fetchInfractions();
    fetchMonthlyRevenue();
  }, []);

  useEffect(() => {
    if (monthlyRevenue) {
      const chartData = Object.entries(monthlyRevenue).map(
        ([month, amount]) => ({
          name: month,
          revenue: amount,
        })
      );
      setRevenueData(chartData);
    }
  }, [monthlyRevenue]);

  const totalRevenue = revenues.reduce(
    (acc, revenue) => acc + revenue.amount,
    0
  );
  const totalPendingAmount = reservations
    .filter((r) => r.status === "PENDING")
    .reduce((sum, r) => sum + r.totalAmount, 0);
  const infractionsPending = infractions.filter(
    (r) => r.status === "PENDING"
  ).length;

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalVehicles: vehicles.length || 0,
        availableVehicles:
          vehicles.filter((v) => v.status === "AVAILABLE").length || 0,
        totalClients: clients.length || 0,
        activeReservations:
          reservations.filter((r) => r.status === "CONFIRMED").length || 0,
        revenue: totalRevenue || 0,
        pendingPayments: totalPendingAmount || 0,
      });
    }, 500);
  }, [vehicles, reservations, clients, totalRevenue, totalPendingAmount]);

  const recentReservations = reservations.slice(-5);
  const maintenanceVehicles = vehicles.filter((v) => v.needsMaintenance);

  return (
    <div className="p-4  min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatsCard
          title="Vehicles"
          value={stats.totalVehicles}
          subValue={`${stats.availableVehicles} available`}
          icon={Car}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />

        <StatsCard
          title="Clients"
          value={stats.totalClients}
          subValue="Total registered"
          icon={Users}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />

        <StatsCard
          title="Reservations"
          value={stats.activeReservations}
          subValue="Active now"
          icon={Calendar}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
        />

        <StatsCard
          title="Revenue"
          value={stats.revenue.toLocaleString() + " DH"}
          subValue="This month"
          icon={TrendingUp}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
        />

        <StatsCard
          title="Pending Payments"
          value={stats.pendingPayments.toLocaleString() + " DH"}
          subValue="To be collected"
          icon={CreditCard}
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
        />

        <StatsCard
          title="Infractions"
          value={infractionsPending}
          subValue="Pending resolution"
          icon={AlertTriangle}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="card bg-white shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Monthly Revenue</h2>
            {revenueLoading && (
              <span className="text-sm text-gray-500">Loading...</span>
            )}
          </div>
          <RevenueChart data={revenueData} />
        </div>
      </div>
    </div>
  );
}
