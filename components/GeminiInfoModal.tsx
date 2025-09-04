
import React, { useState, useEffect } from 'react';
import { getGeminiResponse } from '../services/geminiService';
import { CloseIcon } from './icons/CloseIcon';

interface GeminiInfoModalProps {
  query: string;
  onClose: () => void;
}

const GeminiInfoModal: React.FC<GeminiInfoModalProps> = ({ query, onClose }) => {
  const [info, setInfo] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const responseText = await getGeminiResponse(query);
        setInfo(responseText);
      } catch (err) {
        setError('Không thể lấy thông tin từ Gemini API. Vui lòng kiểm tra khóa API và kết nối của bạn.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (query) {
      fetchInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl m-4 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <svg className="w-6 h-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C11.4696 2 10.9609 2.18429 10.5858 2.51253C10.2107 2.84078 10 3.2993 10 3.78947V4.26316H6.5C5.83696 4.26316 5.20107 4.51866 4.73223 4.94737C4.26339 5.37608 4 5.95789 4 6.57895C4 7.10526 4.21053 7.60526 4.58824 8H2.5C2.23478 8 1.98043 8.10536 1.79289 8.29289C1.60536 8.48043 1.5 8.73478 1.5 9V15C1.5 15.2652 1.60536 15.5196 1.79289 15.7071C1.98043 15.8946 2.23478 16 2.5 16H4.58824C4.21053 16.3947 4 16.8947 4 17.4211C4 18.0421 4.26339 18.6239 4.73223 19.0526C5.20107 19.4813 5.83696 19.7368 6.5 19.7368H10V20.2105C10 20.7007 10.2107 21.1592 10.5858 21.4875C10.9609 21.8157 11.4696 22 12 22C12.5304 22 13.0391 21.8157 13.4142 21.4875C13.7893 21.1592 14 20.7007 14 20.2105V19.7368H17.5C18.163 19.7368 18.7989 19.4813 19.2678 19.0526C19.7366 18.6239 20 18.0421 20 17.4211C20 16.8947 19.7895 16.3947 19.4118 16H21.5C21.7652 16 22.0196 15.8946 22.2071 15.7071C22.3946 15.5196 22.5 15.2652 22.5 15V9C22.5 8.73478 22.3946 8.48043 22.2071 8.29289C22.0196 8.10536 21.7652 8 21.5 8H19.4118C19.7895 7.60526 20 7.10526 20 6.57895C20 5.95789 19.7366 5.37608 19.2678 4.94737C18.7989 4.51866 18.163 4.26316 17.5 4.26316H14V3.78947C14 3.2993 13.7893 2.84078 13.4142 2.51253C13.0391 2.18429 12.5304 2 12 2Z" /></svg>
            Trợ lý Gemini AI
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <CloseIcon />
          </button>
        </div>
        <div className="overflow-y-auto flex-grow pr-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
              <p className="font-bold">Lỗi</p>
              <p>{error}</p>
            </div>
          ) : (
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">{info}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeminiInfoModal;
