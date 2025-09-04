
import { useState, useEffect, useCallback } from 'react';
import { Chemical, Notification } from '../types';

const getInitialChemicals = (): Chemical[] => {
  try {
    const item = window.localStorage.getItem('chemicals');
    return item ? JSON.parse(item) : [
        { id: '1', name: 'Axit clohydric', initialQuantity: 1000, currentQuantity: 850, unit: 'mL', entryDate: '2023-01-10', expiryDate: '2025-01-10', dailyUsage: 2, warningThreshold: 20, notificationChannel: 'https://api.telegram.org/bot-example/sendMessage' },
        { id: '2', name: 'Cồn 95%', initialQuantity: 5000, currentQuantity: 1200, unit: 'mL', entryDate: '2023-02-20', expiryDate: '2026-02-20', dailyUsage: 15, warningThreshold: 25 },
        { id: '3', name: 'Natri Clorua', initialQuantity: 2000, currentQuantity: 150, unit: 'g', entryDate: '2023-03-15', expiryDate: '2028-03-15', dailyUsage: 5, warningThreshold: 10, notificationChannel: 'https://openapi.zalo.me/v2.0/oa/message-example' },
        { id: '4', name: 'Đĩa thạch Agar', initialQuantity: 500, currentQuantity: 480, unit: 'đĩa', entryDate: '2023-10-01', expiryDate: '2024-09-30', dailyUsage: 0.5, warningThreshold: 15 },
        { id: '5', name: 'Nước cất', initialQuantity: 20000, currentQuantity: 100, unit: 'mL', entryDate: '2023-01-01', expiryDate: '2025-01-01', dailyUsage: 50, warningThreshold: 5, notificationChannel: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX' },
    ];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const useInventory = () => {
  const [chemicals, setChemicals] = useState<Chemical[]>(getInitialChemicals);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [triggeredWarnings, setTriggeredWarnings] = useState<Set<string>>(new Set());

  useEffect(() => {
    window.localStorage.setItem('chemicals', JSON.stringify(chemicals));
  }, [chemicals]);
  
  const addNotification = useCallback((title: string, message: string, channel?: string) => {
    const newNotification: Notification = {
        id: Date.now(),
        title,
        message,
        channel,
    };
    setNotifications(prev => [...prev, newNotification]);
  }, []);

  const clearNotification = (id: number) => {
      setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const processDailyUsage = useCallback(() => {
    setChemicals(prevChemicals => {
      const updatedChemicals = prevChemicals.map(chem => {
        if (chem.dailyUsage > 0 && chem.currentQuantity > 0) {
          const newQuantity = Math.max(0, chem.currentQuantity - chem.dailyUsage);
          return { ...chem, currentQuantity: newQuantity };
        }
        return chem;
      });

      // Check for warnings after updating quantities
      updatedChemicals.forEach(chem => {
        const thresholdQuantity = (chem.initialQuantity * chem.warningThreshold) / 100;
        if (chem.currentQuantity > 0 && chem.currentQuantity <= thresholdQuantity) {
            if (!triggeredWarnings.has(chem.id)) {
                addNotification(
                    'Cảnh báo Tồn kho Thấp',
                    `'${chem.name}' đã dưới ngưỡng cảnh báo (${chem.warningThreshold}%). Số lượng còn lại: ${chem.currentQuantity.toFixed(2)} ${chem.unit}.`,
                    chem.notificationChannel
                );
                setTriggeredWarnings(prev => new Set(prev).add(chem.id));
            }
        } else if (chem.currentQuantity > thresholdQuantity) {
            // Reset warning if stock is replenished
            if(triggeredWarnings.has(chem.id)){
                setTriggeredWarnings(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(chem.id);
                    return newSet;
                });
            }
        }
      });

      return updatedChemicals;
    });
  }, [addNotification, triggeredWarnings]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      processDailyUsage();
    }, 5000); // Simulate daily deduction every 5 seconds for demo
    return () => clearInterval(timer);
  }, [processDailyUsage]);


  const addChemical = (chemicalData: Omit<Chemical, 'id' | 'currentQuantity'>) => {
    const newChemical: Chemical = {
      ...chemicalData,
      id: new Date().toISOString(),
      currentQuantity: chemicalData.initialQuantity,
    };
    setChemicals(prev => [newChemical, ...prev]);
  };

  const updateChemical = (updatedChemical: Chemical) => {
    setChemicals(prev =>
      prev.map(chem => (chem.id === updatedChemical.id ? updatedChemical : chem))
    );
  };

  const deleteChemical = (id: string) => {
    setChemicals(prev => prev.filter(chem => chem.id !== id));
  };
  
  return { chemicals, addChemical, updateChemical, deleteChemical, notifications, clearNotification };
};

export default useInventory;
