import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from '@/hooks/use-toast';
import usePdfMake from '@/hooks/use-pdfmake';

import BasicContract from '@/documents/BasicContract';

export default function BasicContractButton({ student, group }) {
  const { data: session } = useSession();
  const [company, setCompany] = useState(null);
  const pdfMake = usePdfMake();

  useEffect(() => {
    if (!session?.user?.companyId) return;
    async function fetchCompany() {
      try {
        const response = await fetch(`/api/company/${session.user.companyId}`);
        if (response.ok) {
          const companyData = await response.json();
          setCompany(companyData);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных компании', error.message);
        toast({
          duration: 2000,
          variant: 'destructive',
          description: 'Ошибка при загрузке данных компании',
        });
      }
    }
    fetchCompany();
  }, [session]);

  const generatePDF = useCallback(() => {
    if (!pdfMake) {
      console.error('pdfMake не загружен');
      return;
    }

    const docDefinition = BasicContract(student, group, company);
    if (!docDefinition) return;

    pdfMake.createPdf(docDefinition).open();
  }, [pdfMake, student, group]);

  return (
    <button onClick={generatePDF} disabled={!pdfMake || !student}>
      Договор (Основной)
    </button>
  );
}
