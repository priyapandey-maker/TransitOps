import { useEffect, useState, useCallback } from 'react';
import {
  Plus,
  Fuel,
  DollarSign,
  TrendingUp,
  Activity,
  FileText,
  Wrench,
  Eye,
  Edit
} from 'lucide-react';
import {
  getFuelLogs,
  createFuelLog,
  updateFuelLog,
  getExpenses,
  createExpense,
  updateExpense
} from '../services/fuelExpense.api';
import type { FuelLog, FuelFormData } from '../types/fuel.types';
import type { Expense, ExpenseFormData } from '../types/expense.types';
import DataTable from '../components/tables/DataTable';
import type { Column } from '../components/tables/DataTable';
import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import Modal from '../components/ui/Modal';
import FuelForm from '../components/forms/FuelForm';
import ExpenseForm from '../components/forms/ExpenseForm';
import { useAuth } from '../context/AuthContext';
import ActionMenu from '../components/tables/ActionMenu';
import type { ActionMenuItem } from '../components/tables/ActionMenu';

type ActiveTab = 'fuel' | 'expenses';

export default function FuelExpensesPage() {
  const { userRole } = useAuth();

  // RBAC control: Admin, Fleet Manager, Financial Analyst get modification access
  const canModify =
    userRole === 'Admin' ||
    userRole === 'Fleet Manager' ||
    userRole === 'Financial Analyst';

  // Active Tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('fuel');

  // State Management - Fuel Logs
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [fuelLoading, setFuelLoading] = useState(true);
  const [fuelSearch, setFuelSearch] = useState('');
  const [fuelCurrentPage, setFuelCurrentPage] = useState(1);

  // State Management - Expenses
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseLoading, setExpenseLoading] = useState(true);
  const [expenseSearch, setExpenseSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [expenseCurrentPage, setExpenseCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingFuelLog, setEditingFuelLog] = useState<FuelLog | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Detailed Modal view
  const [selectedFuelLog, setSelectedFuelLog] = useState<FuelLog | null>(null);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  // Load Fuel Logs from API
  const loadFuelLogs = useCallback(async () => {
    setFuelLoading(true);
    try {
      const response = await getFuelLogs({ search: fuelSearch || undefined });
      if (response.success) {
        setFuelLogs(response.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFuelLoading(false);
    }
  }, [fuelSearch]);

  // Load Expenses from API
  const loadExpenses = useCallback(async () => {
    setExpenseLoading(true);
    try {
      const response = await getExpenses({
        search: expenseSearch || undefined,
        category: categoryFilter || undefined,
      });
      if (response.success) {
        setExpenses(response.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setExpenseLoading(false);
    }
  }, [expenseSearch, categoryFilter]);

  // Trigger loads based on active view
  useEffect(() => {
    if (activeTab === 'fuel') {
      loadFuelLogs();
    } else {
      loadExpenses();
    }
  }, [activeTab, loadFuelLogs, loadExpenses]);

  // Form submit - Fuel
  const handleFuelFormSubmit = async (data: FuelFormData) => {
    setFormLoading(true);
    setFormError(null);
    try {
      let response;
      if (editingFuelLog) {
        response = await updateFuelLog(editingFuelLog.id, data);
      } else {
        response = await createFuelLog(data);
      }

      if (response.success) {
        setIsFormModalOpen(false);
        setEditingFuelLog(null);
        loadFuelLogs();
      }
    } catch (err: unknown) {
      const parsed = err as { message?: string };
      setFormError(parsed.message || 'Validation failed. Please verify form values.');
    } finally {
      setFormLoading(false);
    }
  };

  // Form submit - Expense
  const handleExpenseFormSubmit = async (data: ExpenseFormData) => {
    setFormLoading(true);
    setFormError(null);
    try {
      let response;
      if (editingExpense) {
        response = await updateExpense(editingExpense.id, data);
      } else {
        response = await createExpense(data);
      }

      if (response.success) {
        setIsFormModalOpen(false);
        setEditingExpense(null);
        loadExpenses();
      }
    } catch (err: unknown) {
      const parsed = err as { message?: string };
      setFormError(parsed.message || 'Validation failed. Please verify form values.');
    } finally {
      setFormLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingFuelLog(null);
    setEditingExpense(null);
    setFormError(null);
    setIsFormModalOpen(true);
  };

  const openEditFuelModal = (log: FuelLog) => {
    setEditingFuelLog(log);
    setEditingExpense(null);
    setFormError(null);
    setIsFormModalOpen(true);
  };

  const openEditExpenseModal = (exp: Expense) => {
    setEditingExpense(exp);
    setEditingFuelLog(null);
    setFormError(null);
    setIsFormModalOpen(true);
  };

  // Dynamic calculations for cards
  const totalExpenseCost = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalFuelCost = fuelLogs.reduce((sum, f) => sum + f.cost, 0);

  // Cost per KM calculation (Total expenses / active vehicle odometer sum approx 44,800 km)
  const simulatedOdometerKM = 44800;
  const costPerKm = simulatedOdometerKM > 0 ? (totalExpenseCost / simulatedOdometerKM).toFixed(2) : '0.00';

  // Average fuel efficiency (liters relative to odometer)
  const totalLiters = fuelLogs.reduce((sum, f) => sum + f.liters, 0);
  const avgMileage = totalLiters > 0 ? (simulatedOdometerKM / totalLiters).toFixed(1) : '0.0';

  // Columns definition - Fuel Logs
  const fuelColumns: Column<FuelLog>[] = [
    {
      header: 'Vehicle Identifier',
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            <Fuel size={16} />
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-white leading-none mb-1">
              {row.vehicle_name || `Asset #${row.vehicle_id}`}
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500 font-mono tracking-wider">
              {row.registration_number || 'UNKNOWN'}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Fuel Volume',
      accessor: (row) => `${row.liters.toLocaleString()} Liters`,
    },
    {
      header: 'Refuel Cost',
      accessor: (row) => (
        <span className="text-xs font-semibold text-slate-900 dark:text-white font-mono">
          ₹{row.cost.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Cost Per Liter',
      accessor: (row) => (
        <span className="text-xs text-slate-450 dark:text-slate-500 font-medium">
          ₹{(row.cost / row.liters).toFixed(1)}/L
        </span>
      ),
    },
    {
      header: 'Refuel Date',
      accessor: 'date',
    },
    {
      header: 'Trip ID',
      accessor: (row) => (row.trip_id ? `#TR-${row.trip_id}` : 'None'),
      className: 'font-mono text-xs text-slate-450 dark:text-slate-500',
    },
  ];

  // Actions menu - Fuel Logs
  const renderFuelActions = (log: FuelLog) => {
    const menuActions: ActionMenuItem[] = [
      {
        label: 'View Details',
        icon: <Eye size={14} />,
        onClick: () => setSelectedFuelLog(log),
      },
    ];

    if (canModify) {
      menuActions.push({
        label: 'Edit Log',
        icon: <Edit size={14} />,
        onClick: () => openEditFuelModal(log),
      });
    }

    return (
      <div className="flex justify-end pr-2">
        <ActionMenu actions={menuActions} />
      </div>
    );
  };

  // Columns definition - Expenses
  const expenseColumns: Column<Expense>[] = [
    {
      header: 'Expense Category',
      accessor: (row) => {
        const icons = {
          Fuel: <Fuel size={14} />,
          Maintenance: <Wrench size={14} />,
          Toll: <FileText size={14} />,
          Misc: <DollarSign size={14} />,
        };
        const colors = {
          Fuel: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30',
          Maintenance: 'bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400 border-orange-100 dark:border-orange-900/30',
          Toll: 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border-blue-100 dark:border-blue-900/30',
          Misc: 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
        };
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[row.category]}`}>
            {icons[row.category]}
            {row.category}
          </span>
        );
      },
    },
    {
      header: 'Vehicle Asset',
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900 dark:text-white leading-none mb-1">
            {row.vehicle_name || 'Corporate/Admin'}
          </span>
          <span className="font-mono text-xs text-slate-400 dark:text-slate-500 tracking-wider">
            {row.registration_number || 'No vehicle assigned'}
          </span>
        </div>
      ),
    },
    {
      header: 'Expense Amount',
      accessor: (row) => (
        <span className="text-xs font-semibold text-slate-900 dark:text-white font-mono">
          ₹{row.amount.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Expense Date',
      accessor: 'date',
    },
    {
      header: 'Description',
      accessor: (row) => row.description || 'No description recorded',
      className: 'text-xs text-slate-500 dark:text-slate-400 max-w-xs truncate',
    },
  ];

  // Actions menu - Expenses
  const renderExpenseActions = (exp: Expense) => {
    const menuActions: ActionMenuItem[] = [
      {
        label: 'View Details',
        icon: <Eye size={14} />,
        onClick: () => setSelectedExpense(exp),
      },
    ];

    if (canModify) {
      menuActions.push({
        label: 'Edit Expense',
        icon: <Edit size={14} />,
        onClick: () => openEditExpenseModal(exp),
      });
    }

    return (
      <div className="flex justify-end pr-2">
        <ActionMenu actions={menuActions} />
      </div>
    );
  };

  // Tab selections
  const tabItems = [
    { id: 'fuel', label: 'Fuel Logs', count: fuelLogs.length, icon: <Fuel size={16} /> },
    { id: 'expenses', label: 'Expense Registry', count: expenses.length, icon: <DollarSign size={16} /> },
  ];

  // Paginated fuel logs
  const paginatedFuel = fuelLogs.slice(
    (fuelCurrentPage - 1) * itemsPerPage,
    fuelCurrentPage * itemsPerPage
  );

  // Paginated expenses
  const paginatedExpense = expenses.slice(
    (expenseCurrentPage - 1) * itemsPerPage,
    expenseCurrentPage * itemsPerPage
  );

  // Cost trend bars (horizontal progress elements)
  const categorySummary = [
    { label: 'Fuel Logs', value: totalFuelCost, max: totalExpenseCost, color: 'bg-indigo-500' },
    { label: 'Maintenance Work', value: expenses.filter(e => e.category === 'Maintenance').reduce((sum, e) => sum + e.amount, 0), max: totalExpenseCost, color: 'bg-orange-500' },
    { label: 'Toll Expressway', value: expenses.filter(e => e.category === 'Toll').reduce((sum, e) => sum + e.amount, 0), max: totalExpenseCost, color: 'bg-blue-500' },
    { label: 'Miscellaneous Office', value: expenses.filter(e => e.category === 'Misc').reduce((sum, e) => sum + e.amount, 0), max: totalExpenseCost, color: 'bg-slate-400' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-left">
      {/* Title section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Fuel & Expense Analytics</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
            Monitor overall operational cost indices, calculate fuel efficiencies, and review budget spending.
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
            {activeTab === 'fuel' ? 'Add Fuel Log' : 'Log Expense'}
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total expenses logged */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-cards border border-slate-200 dark:border-slate-800 shadow-sm transition-saas hover:shadow-md group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Expense Summary</p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none mt-2">₹{totalExpenseCost.toLocaleString()}</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1.5 font-medium">Cumulative operational spend</p>
            </div>
            <div className="p-3 rounded-xl transition-saas group-hover:scale-105 bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400 border border-orange-100 dark:border-orange-900/30">
              <DollarSign size={18} />
            </div>
          </div>
        </div>

        {/* Card 2: Cumulative fuel cost */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-cards border border-slate-200 dark:border-slate-800 shadow-sm transition-saas hover:shadow-md group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Fuel Cost Total</p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none mt-2">₹{totalFuelCost.toLocaleString()}</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1.5 font-medium">Liters consumed: {totalLiters.toLocaleString()}L</p>
            </div>
            <div className="p-3 rounded-xl transition-saas group-hover:scale-105 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
              <Fuel size={18} />
            </div>
          </div>
        </div>

        {/* Card 3: Cost per KM */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-cards border border-slate-200 dark:border-slate-800 shadow-sm transition-saas hover:shadow-md group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Cost Per Kilometer</p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none mt-2">₹{costPerKm}</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1.5 font-medium">Relative to active fleet odometers</p>
            </div>
            <div className="p-3 rounded-xl transition-saas group-hover:scale-105 bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400 border border-green-100 dark:border-green-900/30">
              <TrendingUp size={18} />
            </div>
          </div>
        </div>

        {/* Card 4: Average mileage */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-cards border border-slate-200 dark:border-slate-800 shadow-sm transition-saas hover:shadow-md group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Average Mileage</p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none mt-2">{avgMileage} km/L</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1.5 font-medium">Average fuel efficiency index</p>
            </div>
            <div className="p-3 rounded-xl transition-saas group-hover:scale-105 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
              <Activity size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Panels - Content + Chart side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2/3 - Search, tabs, and datatable */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tab Selector & Filters Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-cards shadow-sm">
            {/* Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80">
              {tabItems.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`
                    flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-saas btn-press
                    ${activeTab === tab.id
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200/55 dark:ring-slate-700/55'
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-950 dark:hover:text-slate-200'
                    }
                  `}
                >
                  {tab.icon}
                  {tab.label}
                  <span className="text-[10px] opacity-60 ml-0.5">({tab.count})</span>
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              {activeTab === 'expenses' && (
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setExpenseCurrentPage(1);
                  }}
                  className="
                    px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-950
                    text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800
                    focus:outline-none transition-saas
                  "
                >
                  <option value="">All Categories</option>
                  <option value="Fuel">Fuel</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Toll">Toll</option>
                  <option value="Misc">Misc</option>
                </select>
              )}

              <div className="w-48 sm:w-56">
                <SearchBar
                  placeholder={activeTab === 'fuel' ? 'Search vehicle model...' : 'Search description...'}
                  value={activeTab === 'fuel' ? fuelSearch : expenseSearch}
                  onChange={(val) => {
                    if (activeTab === 'fuel') {
                      setFuelSearch(val);
                      setFuelCurrentPage(1);
                    } else {
                      setExpenseSearch(val);
                      setExpenseCurrentPage(1);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Table display */}
          <div className="bg-white dark:bg-slate-900 rounded-cards border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {activeTab === 'fuel' ? (
              <>
                <DataTable
                  data={paginatedFuel}
                  columns={fuelColumns}
                  actions={renderFuelActions}
                  loading={fuelLoading}
                  emptyTitle="No fuel logs found"
                  emptyDescription="Record a refuel log to calculate your fleet's fuel mileage."
                />
                {!fuelLoading && fuelLogs.length > 0 && (
                  <div className="border-t border-slate-100 dark:border-slate-800">
                    <Pagination
                      currentPage={fuelCurrentPage}
                      totalItems={fuelLogs.length}
                      itemsPerPage={itemsPerPage}
                      onPageChange={setFuelCurrentPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <DataTable
                  data={paginatedExpense}
                  columns={expenseColumns}
                  actions={renderExpenseActions}
                  loading={expenseLoading}
                  emptyTitle="No expense items found"
                  emptyDescription="Log an expense ticket (tolls, workshop service charges) to track operations cost."
                />
                {!expenseLoading && expenses.length > 0 && (
                  <div className="border-t border-slate-100 dark:border-slate-800">
                    <Pagination
                      currentPage={expenseCurrentPage}
                      totalItems={expenses.length}
                      itemsPerPage={itemsPerPage}
                      onPageChange={setExpenseCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right 1/3 - Monthly trend charts & expense category breakdown */}
        <div className="space-y-8">
          
          {/* Cost Categories Breakdown Progress Bars */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-cards shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-5">
              <TrendingUp size={16} className="text-primary-500" />
              Expense Category Breakdown
            </h3>
            
            <div className="space-y-4 text-xs font-semibold">
              {categorySummary.map((cat) => (
                <div key={cat.label} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">{cat.label}</span>
                    <span className="text-slate-900 dark:text-slate-100 font-mono">
                      ₹{cat.value.toLocaleString()} ({totalExpenseCost > 0 ? Math.round((cat.value / totalExpenseCost) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-50 dark:bg-slate-950 overflow-hidden border border-slate-100 dark:border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ease-out ${cat.color}`}
                      style={{ width: `${totalExpenseCost > 0 ? Math.min((cat.value / totalExpenseCost) * 100, 100) : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly trend progress bars */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-cards shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-5">
              <Activity size={16} className="text-primary-500" />
              Monthly Cost Trend (2026)
            </h3>
            
            <div className="space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">May 2026</span>
                  <span className="text-slate-900 dark:text-slate-100 font-mono">₹14,500</span>
                </div>
                <div className="h-2 rounded-full bg-slate-50 dark:bg-slate-950 overflow-hidden border border-slate-100 dark:border-slate-800">
                  <div className="h-full rounded-full bg-primary-500" style={{ width: '45%' }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">June 2026</span>
                  <span className="text-slate-900 dark:text-slate-100 font-mono">₹21,800</span>
                </div>
                <div className="h-2 rounded-full bg-slate-50 dark:bg-slate-950 overflow-hidden border border-slate-100 dark:border-slate-800">
                  <div className="h-full rounded-full bg-primary-500" style={{ width: '68%' }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">July 2026 (Current)</span>
                  <span className="text-slate-900 dark:text-slate-100 font-mono">₹{totalExpenseCost.toLocaleString()}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-50 dark:bg-slate-950 overflow-hidden border border-slate-100 dark:border-slate-800">
                  <div className="h-full rounded-full bg-primary-600 animate-pulse" style={{ width: '90%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Dialog Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={
          activeTab === 'fuel'
            ? editingFuelLog ? 'Edit Fuel Refuel Log' : 'Register Fuel Log'
            : editingExpense ? 'Edit Expense Record' : 'Record Expense Log'
        }
      >
        <div className="space-y-4">
          {formError && (
            <div className="p-3 text-sm text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900/30">
              {formError}
            </div>
          )}
          {activeTab === 'fuel' ? (
            <FuelForm
              initialValues={editingFuelLog || undefined}
              onSubmit={handleFuelFormSubmit}
              onCancel={() => setIsFormModalOpen(false)}
              loading={formLoading}
            />
          ) : (
            <ExpenseForm
              initialValues={editingExpense || undefined}
              onSubmit={handleExpenseFormSubmit}
              onCancel={() => setIsFormModalOpen(false)}
              loading={formLoading}
            />
          )}
        </div>
      </Modal>

      {/* Detailed Fuel View Modal */}
      <Modal
        isOpen={selectedFuelLog !== null}
        onClose={() => setSelectedFuelLog(null)}
        title={`Fuel Log Details #${selectedFuelLog?.id}`}
      >
        {selectedFuelLog && (
          <div className="space-y-5">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs font-semibold leading-normal grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 dark:text-slate-500 block uppercase mb-0.5">Vehicle model</span>
                <span className="text-slate-900 dark:text-slate-100 text-sm">{selectedFuelLog.vehicle_name}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block uppercase mb-0.5">Reg Number</span>
                <span className="text-slate-900 dark:text-slate-100 text-sm font-mono">{selectedFuelLog.registration_number}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-semibold leading-normal">
              <div>
                <span className="text-slate-400 dark:text-slate-500 block uppercase mb-0.5">Fuel Volume</span>
                <span className="text-slate-800 dark:text-slate-200 text-sm">{selectedFuelLog.liters.toLocaleString()} Liters</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block uppercase mb-0.5">Total Cost</span>
                <span className="text-slate-800 dark:text-slate-200 text-sm font-mono">₹{selectedFuelLog.cost.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block uppercase mb-0.5">Cost Per Liter</span>
                <span className="text-slate-800 dark:text-slate-200 text-sm font-mono">₹{(selectedFuelLog.cost / selectedFuelLog.liters).toFixed(2)}/L</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block uppercase mb-0.5">Refuel Date</span>
                <span className="text-slate-800 dark:text-slate-200 text-sm">{selectedFuelLog.date}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Detailed Expense View Modal */}
      <Modal
        isOpen={selectedExpense !== null}
        onClose={() => setSelectedExpense(null)}
        title={`Expense Log Details #${selectedExpense?.id}`}
      >
        {selectedExpense && (
          <div className="space-y-5 text-left">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs font-semibold leading-normal grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 dark:text-slate-500 block uppercase mb-0.5">Vehicle assigned</span>
                <span className="text-slate-900 dark:text-slate-100 text-sm">{selectedExpense.vehicle_name || 'Corporate/Admin'}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block uppercase mb-0.5">Reg Number</span>
                <span className="text-slate-900 dark:text-slate-100 text-sm font-mono">{selectedExpense.registration_number || 'None'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-semibold leading-normal">
              <div>
                <span className="text-slate-400 dark:text-slate-500 block uppercase mb-0.5">Expense Amount</span>
                <span className="text-slate-800 dark:text-slate-200 text-sm font-mono">₹{selectedExpense.amount.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block uppercase mb-0.5">Category</span>
                <span className="text-slate-800 dark:text-slate-200 text-sm font-mono">{selectedExpense.category}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block uppercase mb-0.5">Expense Date</span>
                <span className="text-slate-800 dark:text-slate-200 text-sm">{selectedExpense.date}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block uppercase mb-0.5">Trip ID</span>
                <span className="text-slate-800 dark:text-slate-200 text-sm font-mono">{selectedExpense.trip_id ? `#TR-${selectedExpense.trip_id}` : 'None'}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider block mb-1">Expense Description</span>
              <p className="text-slate-805 dark:text-slate-200 text-sm bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-250/60 dark:border-slate-800 leading-relaxed">
                {selectedExpense.description || 'No description recorded'}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
