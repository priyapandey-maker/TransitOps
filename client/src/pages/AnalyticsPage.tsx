import { useEffect, useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Fuel,
  BarChart3,
  Lightbulb,
  CheckCircle2,
  Truck,
  Wrench,
  Download
} from 'lucide-react';
import { getAnalyticsReport } from '../services/analytics.api';
import type { AnalyticsReport } from '../services/analytics.api';
import DataTable from '../components/tables/DataTable';
import type { Column } from '../components/tables/DataTable';
import Loader from '../components/common/Loader';
import { useAuth } from '../context/AuthContext';
import { exportToPdf } from '../utils/pdfExport';

export default function AnalyticsPage() {
  const { userRole } = useAuth();
  const [data, setData] = useState<AnalyticsReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const response = await getAnalyticsReport();
        if (response.success) {
          setData(response.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !data) {
    return <Loader message="Analyzing fleet performance metrics..." />;
  }

  // Top KPIs mapping
  const kpis = [
    {
      label: 'Fleet Utilization',
      value: `${data.fleet_utilization}%`,
      subtitle: 'Optimal active duty range',
      icon: TrendingUp,
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30'
    },
    {
      label: 'Monthly Cost Index',
      value: `₹${data.operational_cost.toLocaleString()}`,
      subtitle: 'All cost categories combined',
      icon: DollarSign,
      color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30'
    },
    {
      label: 'Fuel Efficiency',
      value: `${data.fuel_efficiency} km/L`,
      subtitle: 'Fleet average mileage',
      icon: Fuel,
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30'
    },
    {
      label: 'Average Vehicle ROI',
      value: `${data.average_roi}%`,
      subtitle: 'Net returns on assets',
      icon: BarChart3,
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30'
    }
  ];

  // Top Performing Vehicles Columns
  const columns: Column<(typeof data.top_vehicles)[0]>[] = [
    {
      header: 'Vehicle Asset',
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/40 dark:border-slate-700/50">
            {row.vehicle_type === 'Truck' ? <Truck size={16} /> : <Truck size={16} />}
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-white leading-none mb-1">
              {row.vehicle_name}
            </div>
            <div className="text-xs text-slate-450 dark:text-slate-500 font-mono tracking-wider">
              {row.registration_number}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Completed Trips',
      accessor: (row) => (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">
          {row.trips_completed} dispatches
        </span>
      ),
    },
    {
      header: 'Net Revenue',
      accessor: (row) => (
        <span className="text-xs text-slate-900 dark:text-slate-200 font-semibold font-mono">
          ₹{row.total_revenue.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Total Cost',
      accessor: (row) => (
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          ₹{row.total_expenses.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Odometer Efficiency',
      accessor: (row) => `${row.fuel_efficiency} km/L`,
    },
    {
      header: 'Net ROI Score',
      accessor: (row) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 border border-green-150">
          {row.net_roi}% ROI
        </span>
      ),
    },
  ];

  // Calculate maximum monthly cost to scale the bars relatively
  const maxMonthCost = Math.max(...data.monthly_costs.map(m => m.spend)) || 1;

  const handleExportPDF = () => {
    if (!data) return;
    const kpis = [
      { label: 'Fleet Utilization', value: `${data.fleet_utilization}%` },
      { label: 'Monthly Cost Index', value: `₹${data.operational_cost.toLocaleString()}` },
      { label: 'Fuel Efficiency', value: `${data.fuel_efficiency} km/L` },
      { label: 'Average Vehicle ROI', value: `${data.average_roi}%` },
    ];
    const headers = ['Vehicle Name Model', 'Registration', 'Asset Type', 'Trips Count', 'Net Revenue', 'Net ROI Score'];
    const rows = data.top_vehicles.map((v) => [
      v.vehicle_name,
      v.registration_number,
      v.vehicle_type,
      v.trips_completed.toString(),
      `₹${v.total_revenue.toLocaleString()}`,
      `${v.net_roi}% ROI`,
    ]);

    exportToPdf({
      title: 'Business Intelligence Report',
      role: userRole ?? 'Admin',
      kpis,
      headers,
      rows,
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-left">
      {/* Title Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Business Intelligence</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
            Analytics dashboard for tracking fleet capital ROI, fuel efficiency margins, and monthly operational spend.
          </p>
        </div>
        <button
          onClick={handleExportPDF}
          className="
            flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-buttons
            text-slate-700 bg-white hover:bg-slate-50 dark:text-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800
            border border-slate-205 dark:border-slate-800 transition-saas btn-press self-start sm:self-auto
          "
        >
          <Download size={14} />
          <span>Export Report</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white dark:bg-slate-900 p-6 rounded-cards border border-slate-200 dark:border-slate-800 shadow-sm transition-saas hover:shadow-md group">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{kpi.label}</p>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none mt-2">{kpi.value}</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1.5 font-medium">{kpi.subtitle}</p>
              </div>
              <div className={`p-3 rounded-xl transition-saas group-hover:scale-105 ${kpi.color}`}>
                <kpi.icon size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Split visual section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2/3 width) - Charts & Recommendations */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Monthly Operational Cost Trend chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-cards shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-8">
              <DollarSign size={16} className="text-primary-500" />
              Monthly Operational Cost Trend (2026)
            </h3>
            
            {/* Vertical Bar Chart */}
            <div className="h-64 flex items-end justify-between gap-4 px-4 border-b border-slate-100 dark:border-slate-800 pb-1">
              {data.monthly_costs.map((mc) => {
                const heightPercent = Math.round((mc.spend / maxMonthCost) * 100);
                return (
                  <div key={mc.month} className="flex-1 flex flex-col items-center gap-2 group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                      ₹{mc.spend.toLocaleString()}
                    </div>
                    {/* Column Bar */}
                    <div
                      className="w-full rounded-t bg-slate-100 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 group-hover:bg-primary-500 group-hover:border-primary-600 transition-saas"
                      style={{ height: `${heightPercent}%`, minHeight: '8px' }}
                    />
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 whitespace-nowrap select-none mt-1">
                      {mc.month.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI business recommendation insights panel */}
          <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/35 p-6 rounded-cards">
            <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-350 uppercase tracking-wider flex items-center gap-2 mb-4">
              <Lightbulb size={16} />
              Fleet Optimization Recommendations
            </h3>
            
            <ul className="space-y-3.5 text-xs text-indigo-950 dark:text-indigo-300 leading-relaxed font-semibold">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={14} className="text-indigo-500 mt-0.5 shrink-0" />
                <span>
                  <strong>Fuel Cost Margin Alert:</strong> Route optimization algorithms tracked a 6% efficiency hike along the Western Corridor dispatches due to reduced idle delays.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={14} className="text-indigo-500 mt-0.5 shrink-0" />
                <span>
                  <strong>Workshop Audit Notice:</strong> Preventive brake pad overhaul on scheduled maintenance logs is forecast to save approximately ₹42,000 in emergency breakdown towing cost.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column (1/3 width) - Smaller Trend breakdowns */}
        <div className="space-y-8">
          
          {/* Trip Completion Trends */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-cards shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
              <CheckCircle2 size={16} className="text-primary-500" />
              Trip Completion status
            </h3>
            
            <div className="space-y-4 text-xs font-semibold">
              {data.trip_completion.map((trip) => {
                const totalTrips = data.trip_completion.reduce((sum, t) => sum + t.count, 0) || 1;
                return (
                  <div key={trip.status} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">{trip.status}</span>
                      <span className="text-slate-900 dark:text-slate-100 font-mono">
                        {trip.count} dispatches ({Math.round((trip.count / totalTrips) * 100)}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-50 dark:bg-slate-950 overflow-hidden border border-slate-100 dark:border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${trip.color}`}
                        style={{ width: `${Math.round((trip.count / totalTrips) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Maintenance Cost Trends */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-cards shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
              <Wrench size={16} className="text-primary-500" />
              Maintenance Cost breakdown
            </h3>
            
            <div className="space-y-4 text-xs font-semibold">
              {data.maintenance_costs.map((maint) => {
                const totalMaint = data.maintenance_costs.reduce((sum, m) => sum + m.spend, 0) || 1;
                return (
                  <div key={maint.category} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400 truncate max-w-[150px]">{maint.category}</span>
                      <span className="text-slate-900 dark:text-slate-100 font-mono">
                        ₹{maint.spend.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-50 dark:bg-slate-950 overflow-hidden border border-slate-100 dark:border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${maint.color}`}
                        style={{ width: `${Math.round((maint.spend / totalMaint) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Vehicles Table */}
      <div className="space-y-4 text-left">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Top Performing Vehicles</h3>
        <div className="bg-white dark:bg-slate-900 rounded-cards border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <DataTable
            data={data.top_vehicles}
            columns={columns}
            loading={false}
          />
        </div>
      </div>
    </div>
  );
}
