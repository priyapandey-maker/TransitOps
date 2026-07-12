import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { getDrivers, createDriver, updateDriver, deleteDriver } from '../services/driver.api';
import type { Driver, DriverFormData } from '../types/driver.types';
import DataTable from '../components/tables/DataTable';
import type { Column } from '../components/tables/DataTable';
import StatusBadge from '../components/tables/StatusBadge';
import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import DriverForm from '../components/forms/DriverForm';
import { useAuth } from '../context/AuthContext';

export default function DriversPage() {
  const { userRole } = useAuth();

  // RBAC control for drivers (Admin, Dispatcher, Safety Officer get full access)
  const canModify =
    userRole === 'Admin' || userRole === 'Dispatcher' || userRole === 'Safety Officer';

  // State Management
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Confirm delete dialog
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load drivers from API
  const loadDrivers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getDrivers({
        search: search || undefined,
        status: statusFilter || undefined,
      });
      if (response.success) {
        setDrivers(response.data);
      }
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    loadDrivers();
  }, [loadDrivers]);

  // Create or Update driver
  const handleFormSubmit = async (data: DriverFormData) => {
    setFormLoading(true);
    setFormError(null);
    try {
      let response;
      if (editingDriver) {
        response = await updateDriver(editingDriver.id, data);
      } else {
        response = await createDriver(data);
      }

      if (response.success) {
        setIsModalOpen(false);
        setEditingDriver(null);
        loadDrivers();
      }
    } catch (err: unknown) {
      const parsed = err as { message?: string };
      setFormError(parsed.message || 'Validation failed. Please verify form values.');
    } finally {
      setFormLoading(false);
    }
  };

  // Suspend / Soft delete driver
  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    setDeleteLoading(true);
    try {
      const response = await deleteDriver(confirmDeleteId);
      if (response.success) {
        loadDrivers();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
      setConfirmDeleteId(null);
    }
  };

  const openCreateModal = () => {
    setEditingDriver(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (driver: Driver) => {
    setEditingDriver(driver);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Columns definition matching shared table component
  const columns: Column<Driver>[] = [
    {
      header: 'Driver Name',
      accessor: 'name',
      className: 'font-semibold text-slate-900 dark:text-slate-100',
    },
    {
      header: 'License Number',
      accessor: 'license_number',
      className: 'font-mono text-slate-600 dark:text-slate-400',
    },
    {
      header: 'Class',
      accessor: 'license_category',
    },
    {
      header: 'License Expiry',
      accessor: 'license_expiry',
    },
    {
      header: 'Contact',
      accessor: 'contact_number',
    },
    {
      header: 'Safety Score',
      accessor: (row) => `${row.safety_score}/100`,
    },
    {
      header: 'Status',
      accessor: (row) => <StatusBadge status={row.status} />,
    },
  ];

  // Actions menu content
  const renderActions = (driver: Driver) => {
    if (!canModify) return null;
    return (
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => openEditModal(driver)}
          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          title="Edit Driver Profile"
        >
          <Edit size={16} />
        </button>
        {driver.status !== 'Suspended' && (
          <button
            onClick={() => setConfirmDeleteId(driver.id)}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Deactivate Driver"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    );
  };

  // Paginated data slice
  const paginatedDrivers = drivers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Drivers Registry</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Register and monitor active transport drivers and license compliances
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
            Add Driver
          </button>
        )}
      </div>

      {/* Toolbar controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          placeholder="Search by name or license number..."
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
          <option value="Off Duty">Off Duty</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      {/* Data Grid table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-sm overflow-hidden">
        <DataTable
          data={paginatedDrivers}
          columns={columns}
          actions={canModify ? renderActions : undefined}
          loading={loading}
          emptyTitle="No drivers found"
          emptyDescription="Try adjusting your filters or add a new driver to the registry."
        />

        {/* Pagination bar controls */}
        {!loading && drivers.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={drivers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Form Dialog Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDriver ? 'Edit Driver Details' : 'Register New Driver'}
      >
        <div className="space-y-4">
          {formError && (
            <div className="p-3 text-sm text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/20 rounded-lg">
              {formError}
            </div>
          )}
          <DriverForm
            initialValues={editingDriver || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
            loading={formLoading}
          />
        </div>
      </Modal>

      {/* Suspend Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Deactivate Driver"
        message="Are you sure you want to suspend/deactivate this driver? This action will set the status to 'Suspended' and release them from active duties."
        confirmText={deleteLoading ? 'Deactivating...' : 'Deactivate'}
        isDanger
      />
    </div>
  );
}
