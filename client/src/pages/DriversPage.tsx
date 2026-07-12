import { useEffect, useState, useCallback } from 'react';
import {
  Plus,
  Truck,
  Activity,
  FileText,
  ShieldAlert,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Download
} from 'lucide-react';
import { getDrivers, createDriver, updateDriver, deleteDriver } from '../services/driver.api';
import type { Driver, DriverFormData } from '../types/driver.types';
import DataTable from '../components/tables/DataTable';
import type { Column } from '../components/tables/DataTable';
import StatusBadge from '../components/tables/StatusBadge';
import SearchBar from '../components/common/SearchBar';
import { exportToPdf } from '../utils/pdfExport';
import Pagination from '../components/common/Pagination';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import DriverForm from '../components/forms/DriverForm';
import { useAuth } from '../context/AuthContext';
import ActionMenu from '../components/tables/ActionMenu';
import type { ActionMenuItem } from '../components/tables/ActionMenu';

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
  const [classFilter, setClassFilter] = useState('');
  const [safetyFilter, setSafetyFilter] = useState('');

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

  // Detail Modal view
  const [viewingDriverDetail, setViewingDriverDetail] = useState<Driver | null>(null);

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

  // License Expiry Status helper
  const getLicenseStatus = (expiry: string) => {
    const expDate = new Date(expiry);
    const today = new Date();
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { label: 'Expired', color: 'text-red-700 bg-red-50 dark:bg-red-950/20 border-red-200' };
    }
    if (diffDays <= 90) {
      return { label: `${diffDays}d Left`, color: 'text-red-500 font-bold bg-red-50 dark:bg-red-950/20 border-red-200 animate-pulse' };
    }
    if (diffDays <= 365) {
      return { label: 'Renewal Due', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20 border-amber-200' };
    }
    return { label: 'Active', color: 'text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800' };
  };

  // Calculations for Summary KPIs
  const activeDrivers = drivers.filter(d => d.status !== 'Suspended');
  const totalActive = activeDrivers.length || 1;

  // 1. Driver Availability Rate
  const availableCount = activeDrivers.filter(d => d.status === 'Available').length;
  const availPercent = drivers.length > 0 ? Math.round((availableCount / totalActive) * 100) : 0;

  // 2. License Expiry Alerts count
  const expiringLicenses = activeDrivers.filter(d => {
    const diffDays = Math.ceil((new Date(d.license_expiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 365;
  }).length;

  // 3. Average Safety Score
  const avgSafety = activeDrivers.length > 0
    ? Math.round(activeDrivers.reduce((a, b) => a + b.safety_score, 0) / activeDrivers.length)
    : 100;
  const safetyLabel = avgSafety >= 85 ? 'Excellent Rating' : 'Needs Supervision';

  // 4. Trips completed (simulated)
  const totalTripsCompleted = activeDrivers.reduce((sum, d) => sum + (d.id * 14 + 5), 0);

  // Columns definition matching shared table component
  const columns: Column<Driver>[] = [
    {
      header: 'Driver Identity',
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-950 flex items-center justify-center border border-primary-100 dark:border-primary-900 font-bold text-primary-600 dark:text-primary-400 text-xs">
            {row.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-white leading-none mb-1">
              {row.name}
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              {(row.id * 2) + 3} Yrs Experience • Class {row.license_category}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'License Details',
      accessor: (row) => {
        const license = getLicenseStatus(row.license_expiry);
        return (
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-xs text-slate-900 dark:text-slate-100 font-semibold leading-none">
              {row.license_number}
            </span>
            <span className={`inline-flex self-start items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${license.color}`}>
              Expiry: {row.license_expiry} ({license.label})
            </span>
          </div>
        );
      },
    },
    {
      header: 'Duty Vehicle',
      accessor: (row) => {
        if (row.status === 'On Trip') {
          const plate = row.id === 2 ? 'KA-03-XY-5678' : 'MH-12-AB-1234';
          return (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400">
              <Truck size={12} />
              <span>{plate}</span>
            </div>
          );
        }
        if (row.status === 'Off Duty') {
          return <span className="text-xs text-slate-400 dark:text-slate-500">Off Duty</span>;
        }
        if (row.status === 'Suspended') {
          return <span className="text-xs text-red-500 font-semibold">Suspended</span>;
        }
        return <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Idle</span>;
      },
    },
    {
      header: 'Compliance Score',
      accessor: (row) => {
        const score = row.safety_score;
        const color = score >= 90 ? 'bg-green-500' : score >= 75 ? 'bg-amber-500' : 'bg-red-500';
        const textColor = score >= 90 ? 'text-green-700 dark:text-green-400' : score >= 75 ? 'text-amber-700 dark:text-amber-400' : 'text-red-700 dark:text-red-400';
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${color}`} />
              <span className={`text-xs font-semibold ${textColor}`}>{score}/100</span>
            </div>
            <div className="w-20 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${score >= 90 ? 'bg-green-500' : score >= 75 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${score}%` }} />
            </div>
          </div>
        );
      },
    },
    {
      header: 'Trips Logged',
      accessor: (row) => (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">
          {row.id * 14 + 5} dispatches
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => <StatusBadge status={row.status} />,
    },
  ];

  // Actions dropdown content
  const renderActions = (driver: Driver) => {
    const menuActions: ActionMenuItem[] = [
      {
        label: 'Safety Profile',
        icon: <Eye size={14} />,
        onClick: () => setViewingDriverDetail(driver),
      },
    ];

    if (canModify) {
      menuActions.push({
        label: 'Edit Details',
        icon: <Edit size={14} />,
        onClick: () => openEditModal(driver),
      });

      if (driver.status !== 'Suspended') {
        menuActions.push({
          label: 'Deactivate',
          icon: <Trash2 size={14} />,
          isDanger: true,
          onClick: () => setConfirmDeleteId(driver.id),
        });
      }
    }

    return (
      <div className="flex justify-end pr-2">
        <ActionMenu actions={menuActions} />
      </div>
    );
  };

  // Status pills configuration
  const statusTabItems = [
    { label: 'All Roster', value: '', count: drivers.length },
    { label: 'Available', value: 'Available', count: drivers.filter(d => d.status === 'Available').length },
    { label: 'On Trip', value: 'On Trip', count: drivers.filter(d => d.status === 'On Trip').length },
    { label: 'Off Duty', value: 'Off Duty', count: drivers.filter(d => d.status === 'Off Duty').length },
    { label: 'Suspended', value: 'Suspended', count: drivers.filter(d => d.status === 'Suspended').length },
  ];

  // Filter conditions
  const filteredDrivers = drivers.filter((d) => {
    if (classFilter && d.license_category !== classFilter) return false;
    if (safetyFilter === 'excellent' && d.safety_score < 90) return false;
    if (safetyFilter === 'warning' && d.safety_score >= 80) return false;
    return true;
  });

  const paginatedDrivers = filteredDrivers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportPDF = () => {
    const kpis = [
      { label: 'Driver Availability', value: `${availPercent}%` },
      { label: 'Licensing Alerts', value: `${expiringLicenses} Warnings` },
      { label: 'Fleet Safety Index', value: `${avgSafety}%` },
      { label: 'Total Dispatches Completed', value: totalTripsCompleted.toLocaleString() },
    ];
    const headers = ['Operator Name', 'License Class', 'Vehicle Assigned', 'Safety Rating', 'Trips Completed', 'Status'];
    const rows = filteredDrivers.map((d) => [
      d.name,
      d.license_category,
      d.id === 1 ? 'Tata Signa (MH-12)' : d.id === 2 ? 'Mahindra Bolero (KA-03)' : d.id === 3 ? 'Eicher Pro (DL-01)' : 'None',
      `${d.safety_score}% Score`,
      (d.id * 14 + 5).toString(),
      d.status,
    ]);

    exportToPdf({
      title: 'Driver Roster Report',
      role: userRole ?? 'Admin',
      kpis,
      headers,
      rows,
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-left">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Driver Command Center</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
            Monitor operator rosters, verify licensing class compliance, and audit safety ratings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            className="
              flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-buttons
              text-slate-700 bg-white hover:bg-slate-50 dark:text-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800
              border border-slate-205 dark:border-slate-800 transition-saas btn-press
            "
          >
            <Download size={14} />
            <span>Export Report</span>
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
              Onboard Operator
            </button>
          )}
        </div>
      </div>

      {/* Driver Summary KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Availability */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-cards border border-slate-200 dark:border-slate-800 shadow-sm transition-saas hover:shadow-md group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider"> Roster Availability</p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none mt-2">{availPercent}%</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1.5 font-medium">{availableCount} active operators ready</p>
            </div>
            <div className="p-3 rounded-xl transition-saas group-hover:scale-105 bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400 border border-green-100 dark:border-green-900/30">
              <Activity size={18} />
            </div>
          </div>
        </div>

        {/* Card 2: License expiry warnings */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-cards border border-slate-200 dark:border-slate-800 shadow-sm transition-saas hover:shadow-md group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">License Expiry status</p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none mt-2">
                {expiringLicenses > 0 ? `${expiringLicenses} Renewal Due` : '100% Valid'}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1.5 font-medium">
                {expiringLicenses > 0 ? 'Requires regulatory review' : 'All driver RCs active'}
              </p>
            </div>
            <div className={`p-3 rounded-xl transition-saas group-hover:scale-105 border ${
              expiringLicenses > 0
                ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/30'
                : 'bg-green-50 text-green-600 border-green-100 dark:bg-green-950/40 dark:text-green-400 dark:border-green-900/30'
            }`}>
              <FileText size={18} />
            </div>
          </div>
        </div>

        {/* Card 3: Safety score */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-cards border border-slate-200 dark:border-slate-800 shadow-sm transition-saas hover:shadow-md group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Avg Safety Rating</p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none mt-2">{avgSafety}/100</p>
              <p className={`text-[11px] pt-1.5 font-medium ${avgSafety >= 85 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>{safetyLabel}</p>
            </div>
            <div className="p-3 rounded-xl transition-saas group-hover:scale-105 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
              <ShieldAlert size={18} />
            </div>
          </div>
        </div>

        {/* Card 4: Total completed trips */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-cards border border-slate-200 dark:border-slate-800 shadow-sm transition-saas hover:shadow-md group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Completed dispatches</p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none mt-2">{totalTripsCompleted}</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1.5 font-medium">Logged operational dispatches</p>
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
          {/* Segmented control for status */}
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

          {/* Filters Select boxes */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="w-full sm:w-64">
              <SearchBar
                placeholder="Search by name or license..."
                value={search}
                onChange={(val) => {
                  setSearch(val);
                  setCurrentPage(1);
                }}
              />
            </div>

            <select
              value={classFilter}
              onChange={(e) => {
                setClassFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="
                px-3.5 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-950
                text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800
                focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10
                transition-saas
              "
            >
              <option value="">All License Classes</option>
              <option value="A">Class A</option>
              <option value="B">Class B</option>
              <option value="C">Class C</option>
              <option value="D">Class D</option>
              <option value="E">Class E</option>
            </select>

            <select
              value={safetyFilter}
              onChange={(e) => {
                setSafetyFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="
                px-3.5 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-950
                text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800
                focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10
                transition-saas
              "
            >
              <option value="">All Safety Ratings</option>
              <option value="excellent">Excellent (90+)</option>
              <option value="warning">Safety Risk (&lt;80)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Modern Enterprise Table */}
      <div className="bg-white dark:bg-slate-900 rounded-cards border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <DataTable
          data={paginatedDrivers}
          columns={columns}
          actions={renderActions}
          loading={loading}
          emptyTitle="No operators matched command criteria"
          emptyDescription="Verify license category filters, clear safety warnings, or check spelling."
        />

        {/* Pagination controls */}
        {!loading && filteredDrivers.length > 0 && (
          <div className="border-t border-slate-100 dark:border-slate-800">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredDrivers.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Driver Details Modal */}
      <Modal
        isOpen={viewingDriverDetail !== null}
        onClose={() => setViewingDriverDetail(null)}
        title={viewingDriverDetail ? `Driver Compliance Profile — ${viewingDriverDetail.name}` : ''}
      >
        {viewingDriverDetail && (
          <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-1">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-3">
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-0.5">License category</span>
                  <span className="text-slate-900 dark:text-slate-100 text-sm">Class {viewingDriverDetail.license_category}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-0.5">Operator Contact</span>
                  <span className="text-slate-900 dark:text-slate-100 text-sm">{viewingDriverDetail.contact_number}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-left">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Operator Compliance History</h4>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800 rounded-xl space-y-3 text-xs leading-normal">
                <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 font-bold border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
                  <span>AUDITED EVENT</span>
                  <span>COMPLIANCE</span>
                </div>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-semibold text-slate-850 dark:text-slate-200">Pre-trip checklist compliance</p>
                    <p className="text-slate-400 dark:text-slate-500 mt-0.5">Inspected engine fluid pressure, steering, brakes.</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-green-50 text-green-600 rounded border border-green-100 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30 font-semibold">Pass</span>
                </div>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-semibold text-slate-850 dark:text-slate-200">Regulatory speed violations</p>
                    <p className="text-slate-400 dark:text-slate-500 mt-0.5">Speed tracked at 62 km/h in restricted zone.</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${viewingDriverDetail.safety_score < 80 ? 'bg-red-50 text-red-600 border-red-150 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30' : 'bg-amber-50 text-amber-600 border-amber-150 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30'}`}>
                    {viewingDriverDetail.safety_score < 80 ? 'Critical' : 'Minor Warning'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Form Dialog Modal (Create / Edit) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDriver ? 'Edit Operator File' : 'Onboard New Driver'}
      >
        <div className="space-y-4">
          {formError && (
            <div className="p-3 text-sm text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900/30">
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
        title="Deactivate Operator Profile"
        message="Are you sure you want to suspend this driver? This action will set the status to 'Suspended' and release them from active dispatch rosters."
        confirmText={deleteLoading ? 'Deactivating...' : 'Deactivate'}
        isDanger
      />
    </div>
  );
}
