import type { Core } from 'cytoscape';
import jsPDF from 'jspdf';

export type FormatoExport = 'png' | 'pdf';

function descargarBlob(blob: Blob, nombre: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function exportarGrafo(cy: Core | null, formato: FormatoExport) {
  if (!cy) return;

  const pngBlob = cy.png({ output: 'blob', scale: 2, bg: '#0f172a', full: true }) as Blob;

  if (formato === 'png') {
    descargarBlob(pngBlob, `mapa-relaciones-${Date.now()}.png`);
    return;
  }

  const dataUrl = (await blobToDataUrl(pngBlob)) as string;
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  pdf.setFillColor(15, 23, 42);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  pdf.addImage(dataUrl, 'PNG', 10, 15, pageWidth - 20, pageHeight - 30);
  pdf.setTextColor(226, 232, 240);
  pdf.setFontSize(14);
  pdf.text('GobIA · Mapa de relaciones', 10, 10);
  pdf.save(`mapa-relaciones-${Date.now()}.pdf`);
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
