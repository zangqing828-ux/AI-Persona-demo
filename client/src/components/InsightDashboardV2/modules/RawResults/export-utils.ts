/**
 * Export Utilities for Raw Results
 * Supports CSV, JSON, and XLSX export
 */

export type ExportFormat = 'csv' | 'json' | 'xlsx';

/**
 * Convert data to CSV format
 */
export function toCSV(data: Record<string, unknown>[]): string {
  if (data.length === 0) return '';

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Create CSV rows
  const rows = data.map(obj => {
    return headers.map(header => {
      const value = obj[header];
      // Handle different value types
      if (value === null || value === undefined) return '';
      if (typeof value === 'string') {
        // Escape quotes and wrap in quotes if contains comma
        const escaped = value.replace(/"/g, '""');
        return escaped.includes(',') || escaped.includes('\n') ? `"${escaped}"` : escaped;
      }
      if (typeof value === 'object' && value instanceof Date) {
        return value.toISOString();
      }
      return String(value);
    });
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  return csvContent;
}

/**
 * Download data as file
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export data to CSV
 */
export function exportToCSV(
  data: Record<string, unknown>[],
  filename: string = 'export.csv'
) {
  const csv = toCSV(data);
  downloadFile(csv, filename, 'text/csv;charset=utf-8;');
}

/**
 * Export data to JSON
 */
export function exportToJSON(
  data: unknown,
  filename: string = 'export.json'
) {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, filename, 'application/json;charset=utf-8;');
}

/**
 * Export data to XLSX (simplified HTML table approach)
 * For production, consider using xlsx library
 */
export function exportToXLSX(
  data: Record<string, unknown>[],
  filename: string = 'export.xlsx'
) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);

  // Create HTML table
  let table = '<table>';
  table += '<thead><tr>';
  headers.forEach(header => {
    table += `<th>${header}</th>`;
  });
  table += '</tr></thead><tbody>';

  data.forEach(obj => {
    table += '<tr>';
    headers.forEach(header => {
      const value = obj[header];
      table += `<td>${value !== null && value !== undefined ? String(value) : ''}</td>`;
    });
    table += '</tr>';
  });

  table += '</tbody></table>';

  // Create HTML document
  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <style>
          table { border-collapse: collapse; }
          td, th { border: 1px solid #ccc; padding: 8px; }
        </style>
      </head>
      <body>
        ${table}
      </body>
    </html>
  `;

  downloadFile(html, filename, 'application/vnd.ms-excel;charset=utf-8;');
}

/**
 * Main export function
 */
export function exportData(
  data: Record<string, unknown>[] | unknown,
  format: ExportFormat,
  filename?: string
) {
  const timestamp = new Date().toISOString().slice(0, 10);
  const defaultFilename = `ai-persona-export-${timestamp}.${format}`;

  switch (format) {
    case 'csv':
      if (!Array.isArray(data)) {
        throw new Error('CSV export requires array data');
      }
      exportToCSV(data, filename || defaultFilename);
      break;
    case 'json':
      exportToJSON(data, filename || defaultFilename);
      break;
    case 'xlsx':
      if (!Array.isArray(data)) {
        throw new Error('XLSX export requires array data');
      }
      exportToXLSX(data, filename || defaultFilename);
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}
