import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit, Eye, ArrowRight, Play, CheckCircle, Ban } from 'lucide-react';
import { getTrips, createTrip, updateTrip, dispatchTrip, completeTrip, cancelTrip } from '../services/trip.api';
import type { Trip, TripFormData } from '../types/trip.types';
import DataTable from '../components/tables/DataTable';
import type { Column } from '../components/tables/DataTable';
import StatusBadge from '../components/tables/StatusBadge';
import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import TripForm from '../components/forms/TripForm';
import { useAuth } from '../context/AuthContext';

export default function TripsPage() {
  const { userRole } = useAuth();

  // RBAC control for Dispatcher, FM, and Admin
  const canModify = userRole === 'Admin' || userRole === 'Fleet Manager' || userRole === 'Dispatcher';

  // State Management
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Detail Modal
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // Workflow Dialog states
  const [confirmDispatchId, setConfirmDispatchId] = useState<number | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<number | null>(null);
  const [completeTripId, setCompleteTripId] = useState<number | null>(null);

  // Final details submit for completing trip
  const [finalDistance, setFinalDistance] = useState('');
  const [fuelConsumed, setFuelConsumed] = useState('');
  const [completeLoading, setCompleteLoading] = useState(false);

  // Load Trips
  const loadTrips = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getTrips({
        search: search || undefined,
        status: statusFilter || undefined,
      });
      if (response.success) {
        setTrips(response.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  // Form submit
  const handleFormSubmit = async (data: TripFormData) => {
    setFormLoading(true);
    setFormError(null);
    try {
      let response;
      if (editingTrip) {
        response = await updateTrip(editingTrip.id, data);
      } else {
        response = await createTrip(data);
      }

      if (response.success) {
        setIsFormModalOpen(false);
        setEditingTrip(null);
        loadTrips();
      }
    } catch (err: unknown) {
      const parsed = err as { message?: string };
      setFormError(parsed.message || 'Validation failed. Please verify form values.');
    } finally {
      setFormLoading(false);
    }
  };

  // Dispatch trigger
  const handleDispatch = async () => {
    if (!confirmDispatchId) return;
    try {
      const response = await dispatchTrip(confirmDispatchId);
      if (response.success) {
        loadTrips();
        if (selectedTrip?.id === confirmDispatchId) {
          setSelectedTrip(response.data);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmDispatchId(null);
    }
  };

  // Cancel trigger
  const handleCancel = async () => {
    if (!confirmCancelId) return;
    try {
      const response = await cancelTrip(confirmCancelId);
      if (response.success) {
        loadTrips();
        if (selectedTrip?.id === confirmCancelId) {
          setSelectedTrip(response.data);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmCancelId(null);
    }
  };

  // Complete trigger
  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completeTripId) return;
    setCompleteLoading(true);
    try {
      const response = await completeTrip(completeTripId, {
        final_distance: Number(finalDistance),
        fuel_consumed: Number(fuelConsumed),
      });
      if (response.success) {
        loadTrips();
        if (selectedTrip?.id === completeTripId) {
          setSelectedTrip(response.data);
        }
        setCompleteTripId(null);
        setFinalDistance('');
        setFuelConsumed('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCompleteLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingTrip(null);
    setFormError(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (trip: Trip) => {
    setEditingTrip(trip);
    setFormError(null);
    setIsFormModalOpen(true);
  };

  // Table columns definition
  const columns: Column<Trip>[] = [
    {
      header: 'ID',
      accessor: (row) => `#TR-${row.id}`,
      className: 'font-mono text-slate-500 dark:text-slate-400 font-semibold',
    },
    {
      header: 'Route',
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <span>{row.source}</span>
          <ArrowRight size={12} className="text-slate-400" />
          <span>{row.destination}</span>
        </div>
      ),
    },
    {
      header: 'Distance (Est)',
      accessor: (row) => `${row.planned_distance} km`,
    },
    {
      header: 'Cargo Weight',
      accessor: (row) => `${row.cargo_weight} T`,
    },
    {
      header: 'Status',
      accessor: (row) => <StatusBadge status={row.status} />,
    },
  ];

  // Actions menu in DataTable rows
  const renderActions = (trip: Trip) => {
    return (
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => setSelectedTrip(trip)}
          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          title="View Details"
        >
          <Eye size={16} />
        </button>
        {canModify && trip.status === 'Draft' && (
          <button
            onClick={() => openEditModal(trip)}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            title="Edit Details"
          >
            <Edit size={16} />
          </button>
        )}
      </div>
    );
  };

  const paginatedTrips = trips.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Trips Operations</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
            Dispatch, route tracking, and lifecycle workflow management
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
            Create Trip
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          placeholder="Search by source, destination..."
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
            px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900
            text-slate-900 dark:text-slate-100 border border-slate-205 dark:border-slate-800
            focus:outline-none transition-saas
          "
        >
          <option value="">All Statuses</option>
          <option value="Draft">Draft</option>
          <option value="Dispatched">Dispatched</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Grid Table */}
      <div className="bg-white dark:bg-slate-900 rounded-cards border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <DataTable
          data={paginatedTrips}
          columns={columns}
          actions={renderActions}
          loading={loading}
          emptyTitle="No trips recorded"
          emptyDescription="Create a new trip to schedule a delivery dispatch route."
        />

        {!loading && trips.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={trips.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Create / Edit Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingTrip ? 'Modify Trip Plan' : 'Schedule New Route Plan'}
      >
        <div className="space-y-4">
          {formError && (
            <div className="p-3 text-sm text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/20 rounded-lg">
              {formError}
            </div>
          )}
          <TripForm
            initialValues={editingTrip || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormModalOpen(false)}
            loading={formLoading}
          />
        </div>
      </Modal>

      {/* Detail Modal / Details panel */}
      <Modal
        isOpen={selectedTrip !== null}
        onClose={() => setSelectedTrip(null)}
        title={`Trip Details #TR-${selectedTrip?.id}`}
      >
        {selectedTrip && (
          <div className="space-y-6">
            {/* Route Map Header */}
            <div className="bg-slate-50 dark:bg-slate-700/40 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 font-semibold">
                <span>Route</span>
                <StatusBadge status={selectedTrip.status} />
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
                <span>{selectedTrip.source}</span>
                <ArrowRight size={14} className="text-slate-400" />
                <span>{selectedTrip.destination}</span>
              </div>
            </div>

            {/* Workflow status timeline progress bar */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                Lifecycle Timeline
              </h4>
              <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200 dark:before:bg-slate-700">
                {/* Draft Step */}
                <div className="flex items-start gap-4 relative">
                  <div className="h-6 w-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold border-2 border-white dark:border-slate-800 z-10">
                    ✓
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-slate-900 dark:text-white leading-tight">Draft Plan Created</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Ready for dispatch assignment
                    </p>
                  </div>
                </div>

                {/* Dispatch Step */}
                <div className="flex items-start gap-4 relative">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white dark:border-slate-800 z-10 ${
                    selectedTrip.status !== 'Draft' ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                  }`}>
                    {selectedTrip.status !== 'Draft' ? '✓' : '2'}
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-slate-900 dark:text-white leading-tight">Route Dispatched</h5>
                    {selectedTrip.dispatched_at && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Dispatched: {new Date(selectedTrip.dispatched_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Final Step */}
                {selectedTrip.status === 'Cancelled' ? (
                  <div className="flex items-start gap-4 relative">
                    <div className="h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold border-2 border-white dark:border-slate-800 z-10">
                      ✕
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-red-600 dark:text-red-400 leading-tight">Route Cancelled</h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Operational release returned
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4 relative">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white dark:border-slate-800 z-10 ${
                      selectedTrip.status === 'Completed' ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                    }`}>
                      {selectedTrip.status === 'Completed' ? '✓' : '3'}
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-slate-900 dark:text-white leading-tight">Delivery Completed</h5>
                      {selectedTrip.completed_at && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Completed: {new Date(selectedTrip.completed_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Parameters Grid */}
            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-700/60 pt-4 text-sm">
              <div>
                <p className="text-slate-400 dark:text-slate-500 text-xs uppercase font-semibold">Planned distance</p>
                <p className="text-slate-800 dark:text-slate-200 font-medium mt-0.5">{selectedTrip.planned_distance} km</p>
              </div>
              <div>
                <p className="text-slate-400 dark:text-slate-500 text-xs uppercase font-semibold">Cargo Weight</p>
                <p className="text-slate-800 dark:text-slate-200 font-medium mt-0.5">{selectedTrip.cargo_weight} Tons</p>
              </div>
              {selectedTrip.status === 'Completed' && (
                <>
                  <div>
                    <p className="text-slate-400 dark:text-slate-500 text-xs uppercase font-semibold">Final Distance</p>
                    <p className="text-slate-800 dark:text-slate-200 font-medium mt-0.5">{selectedTrip.final_distance} km</p>
                  </div>
                  <div>
                    <p className="text-slate-400 dark:text-slate-500 text-xs uppercase font-semibold">Fuel Consumed</p>
                    <p className="text-slate-800 dark:text-slate-200 font-medium mt-0.5">{selectedTrip.fuel_consumed} Liters</p>
                  </div>
                </>
              )}
            </div>

            {/* Workflow Buttons Actions */}
            {canModify && (
              <div className="flex items-center gap-3 pt-5 border-t border-slate-100 dark:border-slate-700">
                {selectedTrip.status === 'Draft' && (
                  <>
                    <button
                      onClick={() => setConfirmDispatchId(selectedTrip.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors"
                    >
                      <Play size={14} />
                      Dispatch Trip
                    </button>
                    <button
                      onClick={() => setConfirmCancelId(selectedTrip.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg border border-red-200 hover:bg-red-50 text-red-600 dark:border-red-900/40 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Ban size={14} />
                      Cancel Route
                    </button>
                  </>
                )}

                {selectedTrip.status === 'Dispatched' && (
                  <>
                    <button
                      onClick={() => setCompleteTripId(selectedTrip.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
                    >
                      <CheckCircle size={14} />
                      Complete Trip
                    </button>
                    <button
                      onClick={() => setConfirmCancelId(selectedTrip.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg border border-red-200 hover:bg-red-50 text-red-600 dark:border-red-900/40 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Ban size={14} />
                      Cancel Route
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Dispatch confirmation popup */}
      <ConfirmDialog
        isOpen={confirmDispatchId !== null}
        onClose={() => setConfirmDispatchId(null)}
        onConfirm={handleDispatch}
        title="Confirm Trip Dispatch"
        message="Are you sure you want to dispatch this trip? This will lock the assigned vehicle and driver into 'On Trip' status and mark this trip status as 'Dispatched'."
      />

      {/* Cancel confirmation popup */}
      <ConfirmDialog
        isOpen={confirmCancelId !== null}
        onClose={() => setConfirmCancelId(null)}
        onConfirm={handleCancel}
        title="Cancel Trip Route"
        message="Are you sure you want to cancel this trip route? This will release the vehicle and driver back to 'Available' status and set the trip status to 'Cancelled'."
        isDanger
      />

      {/* Complete Trip Closing Parameters Sub-Modal */}
      <Modal
        isOpen={completeTripId !== null}
        onClose={() => setCompleteTripId(null)}
        title="Complete Trip Route Closure"
      >
        <form onSubmit={handleComplete} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Final Odometer Distance (km)
            </label>
            <input
              type="number"
              value={finalDistance}
              onChange={(e) => setFinalDistance(e.target.value)}
              placeholder="e.g. 152"
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-600 focus:outline-none focus:border-primary-500"
              required
              min="1"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Total Fuel Consumed (Liters)
            </label>
            <input
              type="number"
              value={fuelConsumed}
              onChange={(e) => setFuelConsumed(e.target.value)}
              placeholder="e.g. 35"
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-600 focus:outline-none focus:border-primary-500"
              required
              min="1"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setCompleteTripId(null)}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={completeLoading}
              className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700"
            >
              {completeLoading ? 'Completing...' : 'Complete Route'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
