import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit, Eye, CheckCircle, Ban } from 'lucide-react';
import { getMaintenances, createMaintenance, updateMaintenance, closeMaintenance } from '../services/maintenance.api';
import type { Maintenance, MaintenanceFormData } from '../types/maintenance.types';
import DataTable from '../components/tables/DataTable';
import type { Column } from '../components/tables/DataTable';
import StatusBadge from '../components/tables/StatusBadge';
import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import MaintenanceForm from '../components/forms/MaintenanceForm';
import ServiceHistory from '../components/common/ServiceHistory';
import type { HistoryItem } from '../components/common/ServiceHistory';
import { useAuth } from '../context/AuthContext';

export default function MaintenancePage() {
  const { userRole } = useAuth();

  // RBAC control: Admin, Fleet Manager can modify maintenance records
  const canModify = userRole === 'Admin' || userRole === 'Fleet Manager';

  // State Management
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Maintenance | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Detail Modal
  const [selectedRecord, setSelectedRecord] = useState<Maintenance | null>(null);
  const [vehicleHistory, setVehicleHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Workflow Dialog states
  const [closeRecordId, setCloseRecordId] = useState<number | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<number | null>(null);
  const [closingCost, setClosingCost] = useState('');
  const [closeLoading, setCloseLoading] = useState(false);

  // Load Maintenances
  const loadMaintenances = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getMaintenances({
        search: search || undefined,
        status: statusFilter || undefined,
      });
      if (response.success) {
        setMaintenances(response.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    loadMaintenances();
  }, [loadMaintenances]);

  // Load vehicle service history when selectedRecord changes
  useEffect(() => {
    async function loadVehicleHistory() {
      if (!selectedRecord) return;
      setHistoryLoading(true);
      try {
        const response = await getMaintenances({ vehicle_id: selectedRecord.vehicle_id });
        if (response.success) {
          const historyItems: HistoryItem[] = response.data
            .filter((m) => m.id !== selectedRecord.id) // exclude current active record
            .map((m) => ({
              id: m.id,
              date: m.service_date,
              title: `${m.maintenance_type} - ₹${m.cost.toLocaleString()}`,
              subtitle: `Technician: ${m.assigned_technician}`,
              description: m.description,
              status: m.status,
            }));
          setVehicleHistory(historyItems);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setHistoryLoading(false);
      }
    }
    loadVehicleHistory();
  }, [selectedRecord]);

  // Form submit
  const handleFormSubmit = async (data: MaintenanceFormData) => {
    setFormLoading(true);
    setFormError(null);
    try {
      let response;
      if (editingRecord) {
        response = await updateMaintenance(editingRecord.id, data);
      } else {
        response = await createMaintenance(data);
      }

      if (response.success) {
        setIsFormModalOpen(false);
        setEditingRecord(null);
        loadMaintenances();
      }
    } catch (err: unknown) {
      const parsed = err as { message?: string };
      setFormError(parsed.message || 'Validation failed. Please verify form values.');
    } finally {
      setFormLoading(false);
    }
  };

  // Close trigger
  const handleClose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!closeRecordId) return;
    setCloseLoading(true);
    try {
      const response = await closeMaintenance(closeRecordId, closingCost ? Number(closingCost) : undefined);
      if (response.success) {
        loadMaintenances();
        if (selectedRecord?.id === closeRecordId) {
          setSelectedRecord(response.data);
        }
        setCloseRecordId(null);
        setClosingCost('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCloseLoading(false);
    }
  };

  // Cancel trigger
  const handleCancel = async () => {
    if (!confirmCancelId) return;
    try {
      // For cancel we update status to Cancelled via normal update endpoint
      const record = maintenances.find((m) => m.id === confirmCancelId);
      if (record) {
        const response = await updateMaintenance(confirmCancelId, {
          vehicle_id: record.vehicle_id,
          maintenance_type: record.maintenance_type,
          description: record.description,
          service_date: record.service_date,
          next_due_date: record.next_due_date,
          assigned_technician: record.assigned_technician,
          cost: record.cost,
          status: 'Cancelled',
          notes: record.notes,
        });
        if (response.success) {
          loadMaintenances();
          if (selectedRecord?.id === confirmCancelId) {
            setSelectedRecord(response.data);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmCancelId(null);
    }
  };

  const openCreateModal = () => {
    setEditingRecord(null);
    setFormError(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (record: Maintenance) => {
    setEditingRecord(record);
    setFormError(null);
    setIsFormModalOpen(true);
  };

  // Table columns definition
  const columns: Column<Maintenance>[] = [
    {
      header: 'ID',
      accessor: (row) => `#MN-${row.id}`,
      className: 'font-mono text-slate-500 dark:text-slate-400 font-semibold',
    },
    {
      header: 'Vehicle',
      accessor: (row) => row.registration_number || `Asset #${row.vehicle_id}`,
    },
    {
      header: 'Type',
      accessor: (row) => row.maintenance_type,
    },
    {
      header: 'Technician',
      accessor: (row) => row.assigned_technician,
    },
    {
      header: 'Cost',
      accessor: (row) => `₹${row.cost.toLocaleString()}`,
    },
    {
      header: 'Status',
      accessor: (row) => <StatusBadge status={row.status} />,
    },
  ];

  // Actions menu
  const renderActions = (record: Maintenance) => {
    const isClosed = record.status === 'Completed' || record.status === 'Cancelled';
    return (
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => setSelectedRecord(record)}
          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          title="View Details"
        >
          <Eye size={16} />
        </button>
        {canModify && !isClosed && (
          <button
            onClick={() => openEditModal(record)}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            title="Edit Log"
          >
            <Edit size={16} />
          </button>
        )}
      </div>
    );
  };

  const paginatedRecords = maintenances.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Maintenance Logs</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track repairs, schedule routine maintenance inspections, and view service history
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
            Schedule Service
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          placeholder="Search by technician, description, reg..."
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
            focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
            transition-colors duration-150
          "
        >
          <option value="">All Statuses</option>
          <option value="Scheduled">Scheduled</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Grid Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-sm overflow-hidden">
        <DataTable
          data={paginatedRecords}
          columns={columns}
          actions={renderActions}
          loading={loading}
          emptyTitle="No service logs found"
          emptyDescription="Schedule a new maintenance service ticket to track fleet reliability."
        />

        {!loading && maintenances.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={maintenances.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingRecord ? 'Modify Maintenance Log' : 'Schedule Maintenance Ticket'}
      >
        <div className="space-y-4">
          {formError && (
            <div className="p-3 text-sm text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/20 rounded-lg">
              {formError}
            </div>
          )}
          <MaintenanceForm
            initialValues={editingRecord || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormModalOpen(false)}
            loading={formLoading}
          />
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={selectedRecord !== null}
        onClose={() => setSelectedRecord(null)}
        title={`Maintenance Details #MN-${selectedRecord?.id}`}
      >
        {selectedRecord && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="bg-slate-50 dark:bg-slate-700/40 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 font-semibold">
                <span>Vehicle Asset</span>
                <StatusBadge status={selectedRecord.status} />
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                <span>{selectedRecord.registration_number || `Asset #${selectedRecord.vehicle_id}`}</span>
                {selectedRecord.vehicle_name && (
                  <span className="text-xs font-normal text-slate-500 dark:text-slate-400">({selectedRecord.vehicle_name})</span>
                )}
              </div>
            </div>

            {/* Service details parameters */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400 dark:text-slate-500 text-xs uppercase font-semibold">Service Type</p>
                <p className="text-slate-800 dark:text-slate-200 font-medium mt-0.5">{selectedRecord.maintenance_type}</p>
              </div>
              <div>
                <p className="text-slate-400 dark:text-slate-500 text-xs uppercase font-semibold">Assigned Technician</p>
                <p className="text-slate-800 dark:text-slate-200 font-medium mt-0.5">{selectedRecord.assigned_technician}</p>
              </div>
              <div>
                <p className="text-slate-400 dark:text-slate-500 text-xs uppercase font-semibold">Service Date</p>
                <p className="text-slate-800 dark:text-slate-200 font-medium mt-0.5">{selectedRecord.service_date}</p>
              </div>
              <div>
                <p className="text-slate-400 dark:text-slate-500 text-xs uppercase font-semibold">Next Due Date</p>
                <p className="text-slate-800 dark:text-slate-200 font-medium mt-0.5">{selectedRecord.next_due_date || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400 dark:text-slate-500 text-xs uppercase font-semibold">Cost</p>
                <p className="text-slate-800 dark:text-slate-200 font-medium mt-0.5">₹{selectedRecord.cost.toLocaleString()}</p>
              </div>
            </div>

            <div>
              <p className="text-slate-400 dark:text-slate-500 text-xs uppercase font-semibold">Issue Description</p>
              <p className="text-slate-800 dark:text-slate-200 text-sm mt-1 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-700/60">
                {selectedRecord.description}
              </p>
            </div>

            {selectedRecord.notes && (
              <div>
                <p className="text-slate-400 dark:text-slate-500 text-xs uppercase font-semibold">Closing Notes</p>
                <p className="text-slate-800 dark:text-slate-200 text-sm mt-1 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-700/60">
                  {selectedRecord.notes}
                </p>
              </div>
            )}

            {/* Reusable vehicle service history timeline */}
            <div className="border-t border-slate-100 dark:border-slate-700/60 pt-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                Vehicle Service History Chronology
              </h4>
              {historyLoading ? (
                <div className="py-4 text-center">
                  <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
                </div>
              ) : (
                <ServiceHistory items={vehicleHistory} emptyMessage="No prior service records registered for this vehicle." />
              )}
            </div>

            {/* Workflow Action controls */}
            {canModify && (selectedRecord.status === 'Scheduled' || selectedRecord.status === 'In Progress') && (
              <div className="flex items-center gap-3 pt-5 border-t border-slate-100 dark:border-slate-700">
                <button
                  onClick={() => setCloseRecordId(selectedRecord.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
                >
                  <CheckCircle size={14} />
                  Close Ticket
                </button>
                <button
                  onClick={() => setConfirmCancelId(selectedRecord.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg border border-red-200 hover:bg-red-50 text-red-600 dark:border-red-900/40 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Ban size={14} />
                  Cancel Service
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Cancel confirmation prompt */}
      <ConfirmDialog
        isOpen={confirmCancelId !== null}
        onClose={() => setConfirmCancelId(null)}
        onConfirm={handleCancel}
        title="Cancel Maintenance Ticket"
        message="Are you sure you want to cancel this maintenance ticket? This will mark the maintenance status as 'Cancelled' and return the vehicle back to 'Available' status."
        isDanger
      />

      {/* Close Ticket Form Modal */}
      <Modal
        isOpen={closeRecordId !== null}
        onClose={() => setCloseRecordId(null)}
        title="Close Maintenance Ticket"
      >
        <form onSubmit={handleClose} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Final Maintenance Cost (₹, Optional)
            </label>
            <input
              type="number"
              value={closingCost}
              onChange={(e) => setClosingCost(e.target.value)}
              placeholder="e.g. 4500"
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-600 focus:outline-none focus:border-primary-500"
              min="0"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setCloseRecordId(null)}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={closeLoading}
              className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700"
            >
              {closeLoading ? 'Closing...' : 'Close Ticket'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
