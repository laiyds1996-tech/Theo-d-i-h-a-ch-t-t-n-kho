import React from 'react';
import { Chemical, UserRole, AlertStatus, SortKey, SortOrder } from '../types';
import { EditIcon } from './icons/EditIcon';
import { DeleteIcon } from './icons/DeleteIcon';
import { InfoIcon } from './icons/InfoIcon';

interface ChemicalTableProps {
  chemicals: Chemical[];
  onEdit: (chemical: Chemical) => void;
  onDelete: (id: string) => void;
  onShowInfo: (chemicalName: string) => void;
  userRole: UserRole;
  sortKey: SortKey;
  sortOrder: SortOrder;
  onSort: (key: SortKey) => void;
}

const getStatus = (chemical: Chemical): AlertStatus => {
  if (chemical.currentQuantity <= 0) return AlertStatus.EMPTY;
  const threshold = (chemical.initialQuantity * chemical.warningThreshold) / 100;
  if (chemical.currentQuantity <= threshold) return AlertStatus.WARNING;
  return AlertStatus.SUFFICIENT;
};

const statusStyles: { [key in AlertStatus]: string } = {
  [AlertStatus.SUFFICIENT]: 'bg-green-100 text-green-800',
  [AlertStatus.WARNING]: 'bg-yellow-100 text-yellow-800 animate-pulse',
  [AlertStatus.EMPTY]: 'bg-red-100 text-red-800',
};

const SortIndicator: React.FC<{ order: SortOrder | null }> = ({ order }) => {
  if (!order) return null;
  return <span>{order === 'asc' ? '▲' : '▼'}</span>;
};


const ChemicalTable: React.FC<ChemicalTableProps> = ({ chemicals, onEdit, onDelete, onShowInfo, userRole, sortKey, sortOrder, onSort }) => {
  const renderHeader = (label: string, key: SortKey) => (
    <th 
      className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
      onClick={() => onSort(key)}
    >
      <div className="flex items-center justify-between">
        {label}
        {sortKey === key && <SortIndicator order={sortOrder} />}
      </div>
    </th>
  );
  
  return (
    <table className="min-w-full leading-normal">
      <thead>
        <tr>
          {renderHeader('Tên Hóa chất', 'name')}
          {renderHeader('Còn lại', 'currentQuantity')}
          {renderHeader('Trạng thái', 'status')}
          {renderHeader('Ngày Hết hạn', 'expiryDate')}
          {renderHeader('Sử dụng Hàng ngày', 'dailyUsage')}
          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Hành động
          </th>
        </tr>
      </thead>
      <tbody>
        {chemicals.map((chemical) => {
          const status = getStatus(chemical);
          const isExpired = new Date(chemical.expiryDate) < new Date();
          return (
            <tr key={chemical.id} className="hover:bg-gray-50">
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap">{chemical.name}</p>
              </td>
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap">
                  {chemical.currentQuantity.toFixed(2)} {chemical.unit}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div className={`h-1.5 rounded-full ${status === AlertStatus.SUFFICIENT ? 'bg-green-500' : status === AlertStatus.WARNING ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${(chemical.currentQuantity / chemical.initialQuantity) * 100}%`}}></div>
                </div>
              </td>
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                <span className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full ${statusStyles[status]}`}>
                  <span className="relative">{status}</span>
                </span>
              </td>
              <td className={`px-5 py-4 border-b border-gray-200 bg-white text-sm ${isExpired ? 'text-red-600 font-bold' : 'text-gray-900'}`}>
                {new Date(chemical.expiryDate).toLocaleDateString()}
              </td>
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap">{chemical.dailyUsage} {chemical.unit}/ngày</p>
              </td>
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                <div className="flex items-center space-x-2">
                  <button onClick={() => onShowInfo(chemical.name)} className="text-blue-600 hover:text-blue-900 p-1" title="Xem thông tin">
                    <InfoIcon />
                  </button>
                  {userRole === UserRole.ADMIN && (
                    <>
                      <button onClick={() => onEdit(chemical)} className="text-yellow-600 hover:text-yellow-900 p-1" title="Sửa">
                        <EditIcon />
                      </button>
                      <button onClick={() => onDelete(chemical.id)} className="text-red-600 hover:text-red-900 p-1" title="Xóa">
                        <DeleteIcon />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ChemicalTable;