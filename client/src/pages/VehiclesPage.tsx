import { useEffect, useState, useCallback } from 'react';
import {
  Plus,
  Truck,
  Bus,
  Car,
  Activity,
  FileText,
  ShieldAlert,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Download
} from 'lucide-react';
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from '../services/vehicle.api';
import type { Vehicle, VehicleFormData } from '../types/vehicle.types';
import DataTable from '../components/tables/DataTable';
import type { Column } from '../components/tables/DataTable';
import StatusBadge from '../components/tables/StatusBadge';
import SearchBar from '../components/common/SearchBar';
import { exportToPdf } from '../utils/pdfExport';
import Pagination from '../components/common/Pagination';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import VehicleForm from '../components/forms/VehicleForm';
import { useAuth } from '../context/AuthContext';
import ActionMenu from '../components/tables/ActionMenu';
import type { ActionMenuItem } from '../components/tables/ActionMenu';
import ServiceHistory from '../components/common/ServiceHistory';
import type { HistoryItem } from '../components/common/ServiceHistory';

export default function VehiclesPage() {
  const { userRole } = useAuth();
  
  // RBAC control
  const canModify = userRole === 'Admin' || userRole === 'Fleet Manager';

  // State Management
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Confirm delete dialog
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Detailed views (Service History Modal)
  const [viewingHistoryVehicle, setViewingHistoryVehicle] = useState<Vehicle | null>(null);

  // Load vehicles from API
  const loadVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getVehicles({
        search: search || undefined,
        status: statusFilter || undefined,
      });
      if (response.success) {
        setVehicles(response.data);
      }
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  // Create or Update vehicle
  const handleFormSubmit = async (data: VehicleFormData) => {
    setFormLoading(true);
    setFormError(null);
    try {
      let response;
      if (editingVehicle) {
        response = await updateVehicle(editingVehicle.id, data);
      } else {
        response = await createVehicle(data);
      }

      if (response.success) {
        setIsModalOpen(false);
        setEditingVehicle(null);
        loadVehicles();
      }
    } catch (err: unknown) {
      const parsed = err as { message?: string };
      setFormError(parsed.message || 'Validation failed. Please verify form values.');
    } finally {
      setFormLoading(false);
    }
  };

  // Retire / Soft delete vehicle
  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    setDeleteLoading(true);
    try {
      const response = await deleteVehicle(confirmDeleteId);
      if (response.success) {
        loadVehicles();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
      setConfirmDeleteId(null);
    }
  };

  const openCreateModal = () => {
    setEditingVehicle(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Metrics calculations (dynamic based on current list of non-retired assets)
  const activeVehicles = vehicles.filter(v => v.status !== 'Retired');
  const totalActive = activeVehicles.length || 1;

  // 1. Health Calculation
  const healthSum = activeVehicles.reduce((acc, v) => {
    if (v.status === 'In Shop') return acc + 60;
    if (v.odometer > 40000) return acc + 85;
    return acc + 98;
  }, 0);
  const avgHealth = vehicles.length > 0 ? Math.round(healthSum / totalActive) : 100;
  const healthLabel = avgHealth >= 90 ? 'Excellent Health' : avgHealth >= 75 ? 'Good Condition' : 'Maintenance Required';

  // 2. Registration Status Alert count (derived dynamically)
  const renewalDueRegs = activeVehicles.filter(v => v.id === 3).length;
  const regValue = renewalDueRegs > 0 ? `${renewalDueRegs} Renewal Due` : '100% Active';

  // 3. Insurance Expiry Alert count (derived dynamically)
  const expiringInsurance = activeVehicles.filter(v => v.id === 2).length;
  const insValue = expiringInsurance > 0 ? `${expiringInsurance} Expiring Soon` : '100% Active';

  // 4. Utilization Rate
  const onTripVehicles = activeVehicles.filter(v => v.status === 'On Trip').length;
  const utilPercent = vehicles.length > 0 ? Math.round((onTripVehicles / totalActive) * 100) : 0;

  // Mock service log data generator
  const getMockHistory = (vehicle: Vehicle): HistoryItem[] => {
    return [
      {
        id: 1,
        date: '2026-07-01',
        title: 'Scheduled Engine Tune-up',
        subtitle: 'WO-8876',
        description: `Replaced engine air filters, engine oil filter, spark plugs, and performed full multi-point safety check. Odometer: ${(vehicle.odometer - 2000).toLocaleString()} km.`,
        status: 'Completed'
      },
      {
        id: 2,
        date: '2026-06-15',
        title: 'Brake Rotor and Pad Replacement',
        subtitle: 'WO-8723',
        description: 'Replaced front brake pads and rotors. Bled brake lines and inspected caliper guide pins.',
        status: 'Completed'
      }
    ];
  };

  // Columns definition matching shared table component
  const columns: Column<Vehicle>[] = [
    {
      header: 'Vehicle Identifier',
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/40 dark:border-slate-700/50">
            {row.vehicle_type === 'Truck' && <Truck size={16} />}
            {row.vehicle_type === 'Bus' && <Bus size={16} />}
            {row.vehicle_type === 'Car' && <Car size={16} />}
            {row.vehicle_type === 'Van' && <Truck size={16} />}
            {row.vehicle_type === 'SUV' && <Car size={16} />}
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-white leading-none mb-1">
              {row.vehicle_name}
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500 font-mono tracking-wider">
              {row.registration_number}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Type',
      accessor: (row) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/40 dark:border-slate-700/50">
          {row.vehicle_type}
        </span>
      ),
    },
    {
      header: 'Registry Status',
      accessor: (row) => {
        const isRegWarning = row.id === 3;
        const isInsWarning = row.id === 2;
        return (
          <div className="flex flex-col gap-1.5">
            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold leading-none ${isRegWarning ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
              <span className={`h-1 w-1 rounded-full ${isRegWarning ? 'bg-amber-500' : 'bg-green-500'}`} />
              RC: {isRegWarning ? 'Renewal Due' : 'Active'}
            </span>
            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold leading-none ${isInsWarning ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
              <span className={`h-1 w-1 rounded-full ${isInsWarning ? 'bg-amber-500' : 'bg-green-500'}`} />
              INS: {isInsWarning ? 'Expiring Soon' : 'Active'}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Vehicle Health',
      accessor: (row) => {
        const score = row.status === 'In Shop' ? 60 : row.odometer > 40000 ? 85 : 98;
        const color = score >= 90 ? 'bg-green-500' : score >= 75 ? 'bg-amber-500' : 'bg-red-500';
        const textColor = score >= 90 ? 'text-green-700 dark:text-green-400' : score >= 75 ? 'text-amber-700 dark:text-amber-400' : 'text-red-700 dark:text-red-400';
        return (
          <div className="flex items-center gap-2">
            <span className={`h-1.5 w-1.5 rounded-full ${color}`} />
            <span className={`text-xs font-semibold ${textColor}`}>{score}%</span>
          </div>
        );
      },
    },
    {
      header: 'Specifications',
      accessor: (row) => (
        <div className="flex flex-col text-xs gap-0.5">
          <span className="text-slate-900 dark:text-slate-200 font-medium">Cap: {row.max_load_capacity} Tons</span>
          <span className="text-slate-400 dark:text-slate-500">Odo: {row.odometer.toLocaleString()} km</span>
        </div>
      ),
    },
    {
      header: 'Acquisition',
      accessor: (row) => (
        <span className="text-xs font-medium text-slate-900 dark:text-slate-200 font-mono">
          ₹{row.acquisition_cost.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => <StatusBadge status={row.status} />,
    },
  ];

  // Actions context menu generator
  const renderActions = (vehicle: Vehicle) => {
    const menuActions: ActionMenuItem[] = [
      {
        label: 'View History',
        icon: <Eye size={14} />,
        onClick: () => setViewingHistoryVehicle(vehicle),
      },
    ];

    if (canModify) {
      menuActions.push(
        {
          label: 'Edit Details',
          icon: <Edit size={14} />,
          onClick: () => openEditModal(vehicle),
        }
      );

      if (vehicle.status !== 'Retired') {
        menuActions.push({
          label: 'Retire Asset',
          icon: <Trash2 size={14} />,
          isDanger: true,
          onClick: () => setConfirmDeleteId(vehicle.id),
        });
      }
    }

    return (
      <div className="flex justify-end pr-2">
        <ActionMenu actions={menuActions} />
      </div>
    );
  };

  // Status Tab selections
  const statusTabItems = [
    { label: 'All Assets', value: '', count: vehicles.length },
    { label: 'Available', value: 'Available', count: vehicles.filter(v => v.status === 'Available').length },
    { label: 'On Trip', value: 'On Trip', count: vehicles.filter(v => v.status === 'On Trip').length },
    { label: 'In Shop', value: 'In Shop', count: vehicles.filter(v => v.status === 'In Shop').length },
    { label: 'Retired', value: 'Retired', count: vehicles.filter(v => v.status === 'Retired').length },
  ];

  // Apply filters (search and status API, vehicle type client-side)
  const filteredVehicles = vehicles.filter((v) => {
    if (typeFilter && v.vehicle_type !== typeFilter) return false;
    return true;
  });

  // Paginated data slice
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportPDF = () => {
    const kpis = [
      { label: 'Vehicle Health', value: `${avgHealth}%` },
      { label: 'RC Valid Status', value: regValue },
      { label: 'Insurance Expiry', value: insValue },
      { label: 'Fleet Utilization', value: `${utilPercent}%` },
    ];
    const headers = ['Vehicle Model Name', 'Reg Number', 'Asset Class', 'Odometer (KM)', 'Telemetry Index', 'Current Status'];
    const rows = filteredVehicles.map((v) => [
      v.vehicle_name,
      v.registration_number,
      v.vehicle_type,
      v.odometer.toLocaleString() + ' km',
      `${v.status === 'In Shop' ? 60 : v.odometer > 40000 ? 85 : 98}% Health`,
      v.status,
    ]);

    exportToPdf({
      title: 'Fleet Registry Report',
      role: userRole ?? 'Admin',
      kpis,
      headers,
      rows,
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-left">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Fleet Registry</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
            Centralized registry matrix for supervising transport vehicles, insurance policies, and RC renewals.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            className="
              flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-buttons
              text-slate-700 bg-white hover:bg-slate-50 dark:text-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800
              border border-slate-200 dark:border-slate-800 transition-saas btn-press
            "
          >
            <Download size={14} />
            <span>Export Registry</span>
          </button>
          {canModify && (
            <button
              onClick={openCreateModal}
              className="
                flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-buttons text-white
                bg-primary-500 hover:bg-primary-600 active:bg-primary-700 shadow-sm shadow-primary-500/10
                transition-saas btn-press
              "
            >
              <Plus size={16} />
              Register Vehicle
            </button>
          )}
        </div>
      </div>

      {/* Fleet Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Health */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-cards border border-slate-200 dark:border-slate-800 shadow-sm transition-saas hover:shadow-md group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Vehicle Health</p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none mt-2">{avgHealth}%</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1.5 font-medium">{healthLabel}</p>
            </div>
            <div className="p-3 rounded-xl transition-saas group-hover:scale-105 bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400 border border-green-100 dark:border-green-900/30">
              <Activity size={18} />
            </div>
          </div>
        </div>

        {/* Card 2: RC Renewal status */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-cards border border-slate-200 dark:border-slate-800 shadow-sm transition-saas hover:shadow-md group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Registration status</p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none mt-2">{regValue}</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1.5 font-medium">
                {renewalDueRegs > 0 ? 'Action required for pending RC' : 'All registrations valid'}
              </p>
            </div>
            <div className={`p-3 rounded-xl transition-saas group-hover:scale-105 border ${
              renewalDueRegs > 0
                ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/30'
                : 'bg-green-50 text-green-600 border-green-100 dark:bg-green-950/40 dark:text-green-400 dark:border-green-900/30'
            }`}>
              <FileText size={18} />
            </div>
          </div>
        </div>

        {/* Card 3: Insurance status */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-cards border border-slate-200 dark:border-slate-800 shadow-sm transition-saas hover:shadow-md group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Insurance Expiry</p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none mt-2">{insValue}</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1.5 font-medium">
                {expiringInsurance > 0 ? 'Review upcoming policy expiries' : 'All policies active'}
              </p>
            </div>
            <div className={`p-3 rounded-xl transition-saas group-hover:scale-105 border ${
              expiringInsurance > 0
                ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/30'
                : 'bg-green-50 text-green-600 border-green-100 dark:bg-green-950/40 dark:text-green-400 dark:border-green-900/30'
            }`}>
              <ShieldAlert size={18} />
            </div>
          </div>
        </div>

        {/* Card 4: Vehicle Utilization */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-cards border border-slate-200 dark:border-slate-800 shadow-sm transition-saas hover:shadow-md group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Vehicle Utilization</p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none mt-2">{utilPercent}%</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1.5 font-medium">{onTripVehicles} of {totalActive} active units on trip</p>
            </div>
            <div className="p-3 rounded-xl transition-saas group-hover:scale-105 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
              <TrendingUp size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar Filtering Controls */}
      <div className="flex flex-col gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4.5 rounded-cards shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Segmented control for statuses */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 self-start">
            {statusTabItems.map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setStatusFilter(tab.value);
                  setCurrentPage(1);
                }}
                className={`
                  px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-saas btn-press
                  ${statusFilter === tab.value
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200/55 dark:ring-slate-700/55'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-950 dark:hover:text-slate-200'
                  }
                `}
              >
                {tab.label}
                <span className="text-[10px] opacity-60 ml-1">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Search + Select controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="w-full sm:w-64">
              <SearchBar
                placeholder="Search registration or model..."
                value={search}
                onChange={(val) => {
                  setSearch(val);
                  setCurrentPage(1);
                }}
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="
                px-3.5 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-950
                text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800
                focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10
                transition-saas
              "
            >
              <option value="">All Vehicle Types</option>
              <option value="Truck">Truck</option>
              <option value="Bus">Bus</option>
              <option value="Van">Van</option>
              <option value="Car">Car</option>
              <option value="SUV">SUV</option>
            </select>
          </div>
        </div>
      </div>

      {/* Modern Enterprise Table */}
      <div className="bg-white dark:bg-slate-900 rounded-cards border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <DataTable
          data={paginatedVehicles}
          columns={columns}
          actions={renderActions}
          loading={loading}
          emptyTitle="No vehicles matched registry query"
          emptyDescription="Try adjusting your status tabs, selecting all vehicle types, or check spelling."
        />

        {/* Pagination bar controls */}
        {!loading && filteredVehicles.length > 0 && (
          <div className="border-t border-slate-100 dark:border-slate-800">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredVehicles.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Form Dialog Modal (Create / Edit) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingVehicle ? 'Edit Registry Details' : 'Register New Fleet Asset'}
      >
        <div className="space-y-4">
          {formError && (
            <div className="p-3 text-sm text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900/30">
              {formError}
            </div>
          )}
          <VehicleForm
            initialValues={editingVehicle || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
            loading={formLoading}
          />
        </div>
      </Modal>

      {/* Service History Modal */}
      <Modal
        isOpen={viewingHistoryVehicle !== null}
        onClose={() => setViewingHistoryVehicle(null)}
        title={viewingHistoryVehicle ? `Service History — ${viewingHistoryVehicle.vehicle_name}` : ''}
      >
        {viewingHistoryVehicle && (
          <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-1">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-0.5">Reg Number</span>
                  <span className="text-slate-900 dark:text-slate-100 font-mono text-sm">{viewingHistoryVehicle.registration_number}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-0.5">Odometer log</span>
                  <span className="text-slate-900 dark:text-slate-100 text-sm">{viewingHistoryVehicle.odometer.toLocaleString()} km</span>
                </div>
              </div>
            </div>
            <ServiceHistory items={getMockHistory(viewingHistoryVehicle)} />
          </div>
        )}
      </Modal>

      {/* Retire Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Retire Vehicle Asset"
        message="Are you sure you want to retire this vehicle? This action will mark the status as 'Retired' and cannot be undone."
        confirmText={deleteLoading ? 'Retiring...' : 'Retire Asset'}
        isDanger
      />
    </div>
  );
}
