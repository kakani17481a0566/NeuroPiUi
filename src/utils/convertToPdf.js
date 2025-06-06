
import {jsPDF} from 'jspdf';
import {autoTable} from 'jspdf-autotable';

export function conversionToPdf(columns, data, filename) {
  const doc = new jsPDF();

  // Convert columns to header format expected by autoTable
  const headers = columns.map(col => col.header || col); // if column is an object with `header` key
  const rows = data.map(item => columns.map(col => item[col.key || col]));

  autoTable(doc, {
    head: [headers],
    body: rows,
  });

  doc.save(filename);

}
