import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from '../services/vehicle.api';
import type { Vehicle, VehicleFormData } from '../types/vehicle.types';
import DataTable from '../components/tables/DataTable';
import type { Column } from '../components/tables/DataTable';
import StatusBadge from '../components/tables/StatusBadge';
import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import VehicleForm from '../components/forms/VehicleForm';
import { useAuth } from '../context/AuthContext';

export default function VehiclesPage() {
  const { userRole } = useAuth();
  
  // RBAC control
  const canModify = userRole === 'Admin' || userRole === 'Fleet Manager';

  // State Management
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
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

  // Columns definition matching shared table component
  const columns: Column<Vehicle>[] = [
    {
      header: 'Reg Number',
      accessor: 'registration_number',
      className: 'font-mono text-slate-900 dark:text-slate-100 font-semibold',
    },
    {
      header: 'Vehicle Model',
      accessor: 'vehicle_name',
    },
    {
      header: 'Type',
      accessor: 'vehicle_type',
    },
    {
      header: 'Capacity',
      accessor: (row) => `${row.max_load_capacity} Tons`,
    },
    {
      header: 'Odometer',
      accessor: (row) => `${row.odometer.toLocaleString()} km`,
    },
    {
      header: 'Cost',
      accessor: (row) => `₹${row.acquisition_cost.toLocaleString()}`,
    },
    {
      header: 'Status',
      accessor: (row) => <StatusBadge status={row.status} />,
    },
  ];

  // Actions menu content
  const renderActions = (vehicle: Vehicle) => {
    if (!canModify) return null;
    return (
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => openEditModal(vehicle)}
          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          title="Edit Vehicle"
        >
          <Edit size={16} />
        </button>
        {vehicle.status !== 'Retired' && (
          <button
            onClick={() => setConfirmDeleteId(vehicle.id)}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Retire Vehicle"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    );
  };

  // Paginated data slice
  const paginatedVehicles = vehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Fleet Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Register and monitor fleet vehicle assets
          </p>
        </div>
        {canModify && (
          <button
            onClick={openCreateModal}
            className="
              flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg text-white
              bg-primary-600 hover:bg-primary-700 active:bg-primary-800 shadow-sm
              transition-colors duration-150
            "
          >
            <Plus size={16} />
            Add Vehicle
          </button>
        )}
      </div>

      {/* Toolbar controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          placeholder="Search by registration or model..."
          value={search}
          onChange={(val) => {
            setSearch(val);
            setCurrentPage(1);
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="
            px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-800
            text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700
            focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500
            transition-colors duration-150
          "
        >
          <option value="">All Statuses</option>
          <option value="Available">Available</option>
          <option value="On Trip">On Trip</option>
          <option value="In Shop">In Shop</option>
          <option value="Retired">Retired</option>
        </select>
      </div>

      {/* Data Grid table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-sm overflow-hidden">
        <DataTable
          data={paginatedVehicles}
          columns={columns}
          actions={canModify ? renderActions : undefined}
          loading={loading}
          emptyTitle="No vehicles found"
          emptyDescription="Try adjusting your filters or add a new vehicle to the registry."
        />

        {/* Pagination bar controls */}
        {!loading && vehicles.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={vehicles.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Form Dialog Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingVehicle ? 'Edit Vehicle Asset' : 'Register New Vehicle'}
      >
        <div className="space-y-4">
          {formError && (
            <div className="p-3 text-sm text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/20 rounded-lg">
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

      {/* Retire Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Retire Vehicle Asset"
        message="Are you sure you want to retire this vehicle? This action will set the status to 'Retired' and cannot be undone."
        confirmText={deleteLoading ? 'Retiring...' : 'Retire Asset'}
        isDanger
      />
    </div>
  );
}
