
// Utility to extract text from PDF files using the injected PDF.js library

export const extractTextFromPDF = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async function() {
      try {
        const typedarray = new Uint8Array(this.result as ArrayBuffer);

        // @ts-ignore
        const pdfjsLib = window.pdfjsLib || window['pdfjsLib'];

        if (!pdfjsLib) {
          reject('La librería PDF.js no se ha cargado en el navegador.');
          return;
        }

        // Ensure worker is configured
        if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }

        const loadingTask = pdfjsLib.getDocument({ data: typedarray });
        const pdf = await loadingTask.promise;
        
        let fullText = '';
        // Limit page processing to avoid browser freeze on massive docs
        const maxPages = Math.min(pdf.numPages, 50); 

        for (let i = 1; i <= maxPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += `[Pág ${i}] ${pageText}\n`;
        }

        if (pdf.numPages > 50) {
            fullText += `\n... [Texto truncado por rendimiento: ${pdf.numPages} páginas totales]`;
        }

        resolve(fullText);
      } catch (error) {
        console.error("Error crítico leyendo PDF:", error);
        reject(`Error al leer PDF: ${(error as any).message}`);
      }
    };

    reader.onerror = (err) => reject("Error de lectura de archivo local.");
    reader.readAsArrayBuffer(file);
  });
};
