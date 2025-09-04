
import { Chemical } from '../types';

export const exportToCSV = (chemicals: Chemical[]) => {
  const headers = ['ID', 'Tên', 'Số lượng ban đầu', 'Số lượng hiện tại', 'Đơn vị', 'Ngày nhập', 'Ngày hết hạn', 'Sử dụng hàng ngày', 'Ngưỡng cảnh báo (%)', 'Kênh Thông báo'];
  const rows = chemicals.map(chem =>
    [
      chem.id,
      `"${chem.name.replace(/"/g, '""')}"`,
      chem.initialQuantity,
      chem.currentQuantity,
      chem.unit,
      chem.entryDate,
      chem.expiryDate,
      chem.dailyUsage,
      chem.warningThreshold,
      `"${chem.notificationChannel || ''}"`
    ].join(',')
  );

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "ton_kho_hoa_chat.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (chemicals: Chemical[]) => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    const tableRows = chemicals.map(chem => `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${chem.name}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${chem.currentQuantity} ${chem.unit}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${new Date(chem.expiryDate).toLocaleDateString()}</td>
        <td style="border: 1px solid #ddd; padding: 8px; max-width: 150px; overflow-wrap: break-word;">${chem.notificationChannel || 'N/A'}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Báo cáo Tồn kho Hóa chất</title>
          <style>
            body { font-family: sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { text-align: left; }
            @media print {
              body { -webkit-print-color-adjust: exact; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Báo cáo Tồn kho Hóa chất - ${new Date().toLocaleDateString()}</h1>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Tên</th>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Còn lại</th>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Ngày hết hạn</th>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Kênh Thông báo</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <script>
            setTimeout(() => { 
                window.print();
                window.close();
            }, 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
};
