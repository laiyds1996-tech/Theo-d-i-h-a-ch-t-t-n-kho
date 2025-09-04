
import React, { useState, useMemo, useCallback } from 'react';
import { Chemical, UserRole, SortKey, SortOrder, AlertStatus } from './types';
import useInventory from './hooks/useInventory';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ChemicalTable from './components/ChemicalTable';
import ChemicalFormModal from './components/ChemicalFormModal';
import SettingsModal from './components/SettingsModal';
import GeminiInfoModal from './components/GeminiInfoModal';
import { exportToCSV, exportToPDF } from './utils/export';
import { PlusIcon } from './components/icons/PlusIcon';

const getStatus = (chemical: Chemical): AlertStatus => {
  if (chemical.currentQuantity <= 0) return AlertStatus.EMPTY;
  const threshold = (chemical.initialQuantity * chemical.warningThreshold) / 100;
  if (chemical.currentQuantity <= threshold) return AlertStatus.WARNING;
  return AlertStatus.SUFFICIENT;
};

const App: React.FC = () => {
  const { 
    chemicals, 
    addChemical, 
    updateChemical, 
    deleteChemical,
    notifications,
    clearNotification
  } = useInventory();
  
  const [role, setRole] = useState<UserRole>(UserRole.ADMIN);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState(false);

  const [editingChemical, setEditingChemical] = useState<Chemical | null>(null);
  const [geminiQuery, setGeminiQuery] = useState<string>('');

  const handleAddNew = () => {
    setEditingChemical(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (chemical: Chemical) => {
    setEditingChemical(chemical);
    setIsFormModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hóa chất này không?')) {
      deleteChemical(id);
    }
  };

  const handleSaveChemical = (chemical: Chemical) => {
    if (editingChemical) {
      updateChemical(chemical);
    } else {
      addChemical(chemical);
    }
    setIsFormModalOpen(false);
    setEditingChemical(null);
  };
  
  const handleShowGeminiInfo = (chemicalName: string) => {
    setGeminiQuery(`Cung cấp tóm tắt ngắn gọn về an toàn và cách xử lý cho ${chemicalName} trong môi trường phòng thí nghiệm.`);
    setIsGeminiModalOpen(true);
  };

  const sortedAndFilteredChemicals = useMemo(() => {
    let filtered = chemicals.filter(chem =>
      chem.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterDate) {
      filtered = filtered.filter(chem => new Date(chem.expiryDate) <= new Date(filterDate));
    }
    
    return [...filtered].sort((a, b) => {
      if (sortKey === 'status') {
        const statusOrder = {
          [AlertStatus.EMPTY]: 2,
          [AlertStatus.WARNING]: 1,
          [AlertStatus.SUFFICIENT]: 0,
        };
        const aStatus = statusOrder[getStatus(a)];
        const bStatus = statusOrder[getStatus(b)];
        const comparison = aStatus - bStatus;
        return sortOrder === 'desc' ? comparison * -1 : comparison;
      }
      
      const aValue = a[sortKey as keyof Chemical] ?? '';
      const bValue = b[sortKey as keyof Chemical] ?? '';

      let comparison = 0;
       if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue, 'vi');
      } else {
        if (aValue > bValue) {
          comparison = 1;
        } else if (aValue < bValue) {
          comparison = -1;
        }
      }
      return sortOrder === 'desc' ? comparison * -1 : comparison;
    });
  }, [chemicals, searchTerm, filterDate, sortKey, sortOrder]);

  const handleSort = useCallback((key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  }, [sortKey]);

  return (
    <div className="min-h-screen text-gray-800">
      <Header
        role={role}
        onRoleChange={setRole}
        onSettingsClick={() => setIsSettingsModalOpen(true)}
      />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-gray-700">Quản lý Hóa chất</h1>
            {role === UserRole.ADMIN && (
              <button
                onClick={handleAddNew}
                className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm"
              >
                <PlusIcon />
                Thêm Hóa chất Mới
              </button>
            )}
          </div>
          <SearchBar
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            filterDate={filterDate}
            onFilterDateChange={setFilterDate}
            onExportCSV={() => exportToCSV(sortedAndFilteredChemicals)}
            onExportPDF={() => exportToPDF(sortedAndFilteredChemicals)}
          />
          <div className="overflow-x-auto">
             <ChemicalTable
                chemicals={sortedAndFilteredChemicals}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onShowInfo={handleShowGeminiInfo}
                userRole={role}
                sortKey={sortKey}
                sortOrder={sortOrder}
                onSort={handleSort}
             />
          </div>
        </div>
      </main>

      {isFormModalOpen && (
        <ChemicalFormModal
          chemical={editingChemical}
          onSave={handleSaveChemical}
          onClose={() => setIsFormModalOpen(false)}
        />
      )}
      
      {isSettingsModalOpen && (
        <SettingsModal onClose={() => setIsSettingsModalOpen(false)} />
      )}
      
      {isGeminiModalOpen && (
        <GeminiInfoModal
          query={geminiQuery}
          onClose={() => setIsGeminiModalOpen(false)}
        />
      )}
      
      {/* Notification Toasts */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow-lg w-full max-w-sm"
            role="alert"
          >
            <div className="flex">
              <div className="py-1">
                <svg className="fill-current h-6 w-6 text-yellow-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM9 5v6h2V5H9zm0 8h2v-2H9v2z"/></svg>
              </div>
              <div>
                <p className="font-bold">{notif.title}</p>
                <p className="text-sm">{notif.message}</p>
                <p className="text-xs text-gray-500 mt-1 break-all">
                  {notif.channel 
                    ? `Mô phỏng gửi đến webhook: ${notif.channel}` 
                    : `Mô phỏng gửi thông báo đến các kênh chung.`
                  }
                </p>
              </div>
              <button onClick={() => clearNotification(notif.id)} className="ml-auto -mx-1.5 -my-1.5 bg-yellow-100 text-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-400 p-1.5 hover:bg-yellow-200 inline-flex h-8 w-8" aria-label="Đóng">&times;</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
