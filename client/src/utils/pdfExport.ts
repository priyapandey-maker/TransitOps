import { jsPDF } from 'jspdf';

interface PdfExportConfig {
  title: string;
  role: string;
  orientation?: 'portrait' | 'landscape';
  kpis?: { label: string; value: string }[];
  headers: string[];
  rows: string[][];
}

export function exportToPdf({
  title,
  role,
  orientation = 'portrait',
  kpis = [],
  headers,
  rows,
}: PdfExportConfig) {
  const doc = new jsPDF({
    orientation: orientation === 'landscape' ? 'l' : 'p',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  let y = 15;

  // Header Title block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text('TransitOps', 15, y);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text('ENTERPRISE FLEET MANAGEMENT SYSTEM', 15, y + 4.5);

  const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  doc.setFontSize(8.5);
  doc.text(`Generated: ${now}`, pageWidth - 15, y, { align: 'right' });
  doc.text(`Role: ${role}`, pageWidth - 15, y + 4.5, { align: 'right' });

  // Divider Line
  y += 10;
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.4);
  doc.line(15, y, pageWidth - 15, y);

  // Document Title
  y += 9;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(title.toUpperCase(), 15, y);

  // KPIs Row (if present)
  if (kpis.length > 0) {
    y += 7;
    const kpiCount = kpis.length;
    const availableWidth = pageWidth - 30;
    const kpiWidth = availableWidth / kpiCount;

    kpis.forEach((kpi, index) => {
      const xPos = 15 + index * kpiWidth;
      
      // Draw background box
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(241, 245, 249);
      doc.rect(xPos, y, kpiWidth - 2, 13, 'DF');

      // Label text
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(148, 163, 184);
      doc.text(kpi.label.toUpperCase(), xPos + 2.5, y + 4);

      // Value text
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(15, 23, 42);
      doc.text(kpi.value, xPos + 2.5, y + 9.5);
    });

    y += 18;
  } else {
    y += 6;
  }

  // Draw Table Columns Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.setFillColor(15, 23, 42); // slate-900 header

  const availableWidth = pageWidth - 30;
  const colWidth = availableWidth / headers.length;

  doc.rect(15, y, availableWidth, 6.5, 'F');
  headers.forEach((header, index) => {
    doc.text(header.toUpperCase(), 17 + index * colWidth, y + 4.5);
  });

  y += 6.5;

  // Draw Rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85); // slate-700

  rows.forEach((row, rowIndex) => {
    // Check page boundaries
    if (y > pageHeight - 18) {
      doc.addPage();
      y = 15;
      // Re-draw Table Header on new page
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(15, 23, 42);
      doc.rect(15, y, availableWidth, 6.5, 'F');
      headers.forEach((header, index) => {
        doc.text(header.toUpperCase(), 17 + index * colWidth, y + 4.5);
      });
      y += 6.5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
    }

    // Zebra striping
    if (rowIndex % 2 === 1) {
      doc.setFillColor(250, 250, 250);
      doc.rect(15, y, availableWidth, 6.2, 'F');
    }

    row.forEach((cell, cellIndex) => {
      doc.text(cell || '', 17 + cellIndex * colWidth, y + 4.2);
    });

    // Row divider
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.15);
    doc.line(15, y + 6.2, pageWidth - 15, y + 6.2);

    y += 6.2;
  });

  // Footer - Page numbers
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
    doc.text('TransitOps - Confidential System Report', 15, pageHeight - 8);
  }

  const filename = `${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}
