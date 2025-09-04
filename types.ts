
export interface Chemical {
  id: string;
  name: string;
  initialQuantity: number;
  currentQuantity: number;
  unit: string;
  entryDate: string;
  expiryDate: string;
  dailyUsage: number;
  warningThreshold: number; // as a percentage (e.g., 10 for 10%)
  notificationChannel?: string;
}

export enum UserRole {
  ADMIN = 'Quản trị',
  STAFF = 'Nhân viên',
}

export enum AlertStatus {
  SUFFICIENT = 'Đủ',
  WARNING = 'Cảnh báo',
  EMPTY = 'Hết hàng',
}

export interface Notification {
    id: number;
    title: string;
    message: string;
    channel?: string;
}

export type SortKey = keyof Chemical | 'status';
export type SortOrder = 'asc' | 'desc';
