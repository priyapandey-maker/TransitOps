import { useEffect, useState, useCallback } from 'react';
import {
  Plus,
  Eye,
  Edit,
  CheckCircle,
  Ban,
  Wrench,
  AlertTriangle,
  DollarSign,
  Clock
} from 'lucide-react';
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
import ActionMenu from '../components/tables/ActionMenu';
import type { ActionMenuItem } from '../components/tables/ActionMenu';

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

  // Dynamic calculations for maintenance summary cards
  const completedLogs = maintenances.filter((m) => m.status === 'Completed');
  const totalCost = completedLogs.reduce((sum, m) => sum + m.cost, 0);

  const activeWorkshopCount = maintenances.filter((m) => m.status === 'In Progress').length;
  const scheduledCount = maintenances.filter((m) => m.status === 'Scheduled').length;

  const priorityRepairsCount = maintenances.filter(
    (m) =>
      m.status === 'In Progress' &&
      (m.maintenance_type === 'Breakdown' || m.maintenance_type === 'Repair')
  ).length;

  // Table columns definition
  const columns: Column<Maintenance>[] = [
    {
      header: 'Operation Identifier',
      accessor: (row) => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-white leading-none mb-1">
            {row.maintenance_type}
          </div>
          <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">
            #MN-{row.id}
          </span>
        </div>
      ),
    },
    {
      header: 'Vehicle Asset',
      accessor: (row) => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-white leading-none mb-1">
            {row.vehicle_name || `Asset #${row.vehicle_id}`}
          </div>
          <span className="font-mono text-xs text-slate-400 dark:text-slate-500 tracking-wider">
            {row.registration_number || 'UNKNOWN'}
          </span>
        </div>
      ),
    },
    {
      header: 'Staff Technician',
      accessor: 'assigned_technician',
    },
    {
      header: 'Service Dates',
      accessor: (row) => (
        <div className="flex flex-col text-xs gap-0.5">
          <span className="text-slate-900 dark:text-slate-200 font-semibold">Service: {row.service_date}</span>
          <span className="text-slate-400 dark:text-slate-500">
            Next Due: {row.next_due_date || 'None'}
          </span>
        </div>
      ),
    },
    {
      header: 'Service Cost',
      accessor: (row) => (
        <span className="text-xs font-semibold text-slate-900 dark:text-white font-mono">
          ₹{row.cost.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => <StatusBadge status={row.status} />,
    },
  ];

  // Actions context menu
  const renderActions = (record: Maintenance) => {
    const isClosed = record.status === 'Completed' || record.status === 'Cancelled';
    const menuActions: ActionMenuItem[] = [
      {
        label: 'View Details',
        icon: <Eye size={14} />,
        onClick: () => setSelectedRecord(record),
      },
    ];

    if (canModify && !isClosed) {
      menuActions.push({
        label: 'Edit Log',
        icon: <Edit size={14} />,
        onClick: () => openEditModal(record),
      });
      menuActions.push({
        label: 'Close Ticket',
        icon: <CheckCircle size={14} />,
        onClick: () => setCloseRecordId(record.id),
      });
      menuActions.push({
        label: 'Cancel Service',
        icon: <Ban size={14} />,
        isDanger: true,
        onClick: () => setConfirmCancelId(record.id),
      });
    }

    return (
      <div className="flex justify-end pr-2">
        <ActionMenu actions={menuActions} />
      </div>
    );
  };

  // Status Tab selections
  const statusTabItems = [
    { label: 'All Operations', value: '', count: maintenances.length },
    { label: 'Scheduled', value: 'Scheduled', count: maintenances.filter(m => m.status === 'Scheduled').length },
    { label: 'In Progress', value: 'In Progress', count: maintenances.filter(m => m.status === 'In Progress').length },
    { label: 'Completed', value: 'Completed', count: maintenances.filter(m => m.status === 'Completed').length },
    { label: 'Cancelled', value: 'Cancelled', count: maintenances.filter(m => m.status === 'Cancelled').length },
  ];

  const paginatedRecords = maintenances.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-left">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Maintenance Operations Center</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
            Schedule preventive inspections, coordinate workshop tickets, and audit completed service logs.
          </p>
        </div>
        {canModify && (
          <button
            onClick={openCreateModal}
            className="
              flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-buttons text-white
              bg-primary-500 hover:bg-primary-600 active:bg-primary-700 shadow-sm shadow-primary-500/10
              transition-saas btn-press
            "
          >
            <Plus size={16} />
            Schedule Service
          </button>
        )}
      </div>

      {/* Summary KPI section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Active workshop units */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-cards border border-slate-200 dark:border-slate-800 shadow-sm transition-saas hover:shadow-md group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Workshop Units</p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none mt-2">{activeWorkshopCount}</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1.5 font-medium">Active repairs in progress</p>
            </div>
            <div className="p-3 rounded-xl transition-saas group-hover:scale-105 bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400 border border-orange-100 dark:border-orange-900/30">
              <Wrench size={18} />
            </div>
          </div>
        </div>

        {/* Card 2: Priority repairs */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-cards border border-slate-200 dark:border-slate-800 shadow-sm transition-saas hover:shadow-md group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Priority Repairs</p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none mt-2">{priorityRepairsCount}</p>
              <p className="text-[11px] text-slate-450 dark:text-slate-500 pt-1.5 font-medium">Emergency workshop tickets</p>
            </div>
            <div className={`p-3 rounded-xl transition-saas group-hover:scale-105 border ${
              priorityRepairsCount > 0
                ? 'bg-red-50 text-red-650 border-red-100 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/30'
                : 'bg-green-50 text-green-600 border-green-100 dark:bg-green-950/40 dark:text-green-400 dark:border-green-900/30'
            }`}>
              <AlertTriangle size={18} />
            </div>
          </div>
        </div>

        {/* Card 3: Total maintenance costs */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-cards border border-slate-200 dark:border-slate-800 shadow-sm transition-saas hover:shadow-md group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Maintenance Costs</p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none mt-2">₹{totalCost.toLocaleString()}</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1.5 font-medium">Logged completed service spend</p>
            </div>
            <div className="p-3 rounded-xl transition-saas group-hover:scale-105 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
              <DollarSign size={18} />
            </div>
          </div>
        </div>

        {/* Card 4: Upcoming services */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-cards border border-slate-200 dark:border-slate-800 shadow-sm transition-saas hover:shadow-md group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Upcoming Services</p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none mt-2">{scheduledCount}</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1.5 font-medium">Preventive inspections scheduled</p>
            </div>
            <div className="p-3 rounded-xl transition-saas group-hover:scale-105 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
              <Clock size={18} />
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

          {/* Search controls */}
          <div className="w-full lg:w-80">
            <SearchBar
              placeholder="Search by technician, description, model..."
              value={search}
              onChange={(val) => {
                setSearch(val);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Modern Enterprise Table */}
      <div className="bg-white dark:bg-slate-900 rounded-cards border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <DataTable
          data={paginatedRecords}
          columns={columns}
          actions={renderActions}
          loading={loading}
          emptyTitle="No service logs matched command query"
          emptyDescription="Verify active status tabs, search technician names, or schedule a service ticket."
        />

        {!loading && maintenances.length > 0 && (
          <div className="border-t border-slate-100 dark:border-slate-800">
            <Pagination
              currentPage={currentPage}
              totalItems={maintenances.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Form Dialog Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingRecord ? 'Modify Maintenance Log' : 'Schedule Maintenance Ticket'}
      >
        <div className="space-y-4">
          {formError && (
            <div className="p-3 text-sm text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900/30">
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
          <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-1">
            {/* Header info */}
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 font-bold">
                <span>Vehicle Asset</span>
                <StatusBadge status={selectedRecord.status} />
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                <span>{selectedRecord.registration_number || `Asset #${selectedRecord.vehicle_id}`}</span>
                {selectedRecord.vehicle_name && (
                  <span className="text-xs font-normal text-slate-400 dark:text-slate-550">({selectedRecord.vehicle_name})</span>
                )}
              </div>
            </div>

            {/* Service details parameters */}
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold leading-normal">
              <div>
                <p className="text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Service Type</p>
                <p className="text-slate-800 dark:text-slate-200 text-sm">{selectedRecord.maintenance_type}</p>
              </div>
              <div>
                <p className="text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Assigned Technician</p>
                <p className="text-slate-800 dark:text-slate-200 text-sm">{selectedRecord.assigned_technician}</p>
              </div>
              <div>
                <p className="text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Service Date</p>
                <p className="text-slate-800 dark:text-slate-200 text-sm">{selectedRecord.service_date}</p>
              </div>
              <div>
                <p className="text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Next Due Date</p>
                <p className="text-slate-800 dark:text-slate-200 text-sm">{selectedRecord.next_due_date || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Cost</p>
                <p className="text-slate-800 dark:text-slate-200 text-sm font-mono">₹{selectedRecord.cost.toLocaleString()}</p>
              </div>
            </div>

            <div>
              <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Issue Description</p>
              <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-250/60 dark:border-slate-800">
                {selectedRecord.description}
              </p>
            </div>

            {selectedRecord.notes && (
              <div>
                <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Closing Notes</p>
                <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-250/60 dark:border-slate-800">
                  {selectedRecord.notes}
                </p>
              </div>
            )}

            {/* Reusable vehicle service history timeline */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-5 text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-405 dark:text-slate-500 mb-3">
                Prior Service History Chronology
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
              <div className="flex items-center gap-3 pt-5 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setCloseRecordId(selectedRecord.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-buttons bg-green-600 hover:bg-green-700 text-white transition-saas btn-press"
                >
                  <CheckCircle size={14} />
                  Close Ticket
                </button>
                <button
                  onClick={() => setConfirmCancelId(selectedRecord.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-buttons border border-red-200 hover:bg-red-50 text-red-650 dark:border-red-900/40 dark:hover:bg-red-900/20 transition-saas btn-press"
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
              className="w-full px-3.5 py-2.5 text-sm rounded-inputs bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-primary-500 transition-saas"
              min="0"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setCloseRecordId(null)}
              className="px-4 py-2 text-sm font-semibold rounded-buttons border border-slate-250 dark:border-slate-800 text-slate-650 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-saas btn-press"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={closeLoading}
              className="px-4 py-2 text-sm font-semibold rounded-buttons text-white bg-green-600 hover:bg-green-700 transition-saas btn-press"
            >
              {closeLoading ? 'Closing...' : 'Close Ticket'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
