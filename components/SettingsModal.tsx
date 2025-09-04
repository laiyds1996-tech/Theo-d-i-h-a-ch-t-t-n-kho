
import React, { useState } from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
    const [telegramToken, setTelegramToken] = useState('');
    const [telegramChatId, setTelegramChatId] = useState('');
    const [zaloToken, setZaloToken] = useState('');
    const [whatsappToken, setWhatsappToken] = useState('');
    
    const handleSave = () => {
        // In a real app, this would save to a secure config store.
        // Here, we just log it and close.
        console.log("Settings saved (simulation):", {
            telegramToken,
            telegramChatId,
            zaloToken,
            whatsappToken
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg m-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Cài đặt Thông báo</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                      <CloseIcon />
                    </button>
                </div>
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Cấu hình chi tiết API để gửi thông báo tồn kho thấp. Đây là một mô phỏng và dữ liệu không được gửi ra bên ngoài.
                    </p>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Telegram</h3>
                        <label className="block text-sm font-medium text-gray-700">Bot Token</label>
                        <input 
                          type="text" 
                          placeholder="Nhập Telegram Bot Token"
                          value={telegramToken}
                          onChange={(e) => setTelegramToken(e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        <label className="block text-sm font-medium text-gray-700 mt-2">Chat ID</label>
                        <input 
                          type="text" 
                          placeholder="Nhập ID Nhóm/Chat Telegram"
                          value={telegramChatId}
                          onChange={(e) => setTelegramChatId(e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Zalo</h3>
                        <label className="block text-sm font-medium text-gray-700">Access Token</label>
                        <input 
                          type="password" 
                          placeholder="Nhập Zalo OA Access Token"
                          value={zaloToken}
                          onChange={(e) => setZaloToken(e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">WhatsApp</h3>
                        <label className="block text-sm font-medium text-gray-700">API Token</label>
                        <input 
                          type="password"
                          placeholder="Nhập WhatsApp Business API Token"
                          value={whatsappToken}
                          onChange={(e) => setWhatsappToken(e.target.value)} 
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                </div>
                <div className="flex justify-end pt-6">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 mr-2">Hủy</button>
                    <button type="button" onClick={handleSave} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">Lưu Cài đặt</button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
