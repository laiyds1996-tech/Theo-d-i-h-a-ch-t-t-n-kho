
import React, { useState, useEffect } from 'react';
import { Chemical } from '../types';
import { CloseIcon } from './icons/CloseIcon';

interface ChemicalFormModalProps {
  chemical: Chemical | null;
  onSave: (chemical: Chemical) => void;
  onClose: () => void;
}

const ChemicalFormModal: React.FC<ChemicalFormModalProps> = ({ chemical, onSave, onClose }) => {
  const [formData, setFormData] = useState<Omit<Chemical, 'id'>>({
    name: '',
    initialQuantity: 1000,
    currentQuantity: 1000,
    unit: 'mL',
    entryDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    dailyUsage: 0,
    warningThreshold: 10,
    notificationChannel: '',
  });

  useEffect(() => {
    if (chemical) {
      setFormData({
        ...chemical,
        entryDate: new Date(chemical.entryDate).toISOString().split('T')[0],
        expiryDate: new Date(chemical.expiryDate).toISOString().split('T')[0],
      });
    }
  }, [chemical]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    let newValue: string | number = value;

    if (isNumber) {
        newValue = value === '' ? '' : parseFloat(value);
        if (isNaN(newValue as number)) newValue = 0;
    }

    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: chemical?.id || '',
      initialQuantity: Number(formData.initialQuantity),
      currentQuantity: chemical ? Number(formData.currentQuantity) : Number(formData.initialQuantity),
      dailyUsage: Number(formData.dailyUsage),
      warningThreshold: Number(formData.warningThreshold),
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg m-4">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{chemical ? 'Sửa Hóa chất' : 'Thêm Hóa chất Mới'}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                <CloseIcon />
            </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Số lượng ban đầu</label>
              <input type="number" name="initialQuantity" value={formData.initialQuantity} onChange={handleChange} min="0" step="any" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            {chemical && (
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Số lượng hiện tại</label>
                    <input type="number" name="currentQuantity" value={formData.currentQuantity} onChange={handleChange} min="0" step="any" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                 </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">Đơn vị (ví dụ: mL, g)</label>
              <input type="text" name="unit" value={formData.unit} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Ngày nhập</label>
              <input type="date" name="entryDate" value={formData.entryDate} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ngày hết hạn</label>
              <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Sử dụng hàng ngày</label>
              <input type="number" name="dailyUsage" value={formData.dailyUsage} onChange={handleChange} min="0" step="any" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ngưỡng cảnh báo (%)</label>
              <input type="number" name="warningThreshold" value={formData.warningThreshold} onChange={handleChange} min="0" max="100" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label htmlFor="notificationChannel" className="block text-sm font-medium text-gray-700">Link Webhook Thông báo (Tùy chọn)</label>
            <input 
              type="url" 
              id="notificationChannel"
              name="notificationChannel" 
              value={formData.notificationChannel || ''} 
              onChange={handleChange} 
              placeholder="https://api.telegram.org/bot..." 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
             <p className="mt-2 text-xs text-gray-500">
              Dán link webhook từ Telegram, Zalo, Slack, etc. để nhận thông báo tự động.
            </p>
          </div>
          <div className="flex justify-end pt-4">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 mr-2">Hủy</button>
            <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChemicalFormModal;
