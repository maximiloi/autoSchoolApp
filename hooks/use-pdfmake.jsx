import { useEffect, useState } from 'react';

export default function usePdfMake() {
  const [pdfMake, setPdfMake] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (async () => {
        try {
          const pdfMakeModule = await import('pdfmake/build/pdfmake');
          const pdfFontsModule = await import('pdfmake/build/vfs_fonts');

          pdfMakeModule.default.vfs = pdfFontsModule.default.vfs;
          setPdfMake(pdfMakeModule.default);
        } catch (error) {
          console.error('Ошибка загрузки pdfMake:', error);
        }
      })();
    }
  }, []);

  return pdfMake;
}
