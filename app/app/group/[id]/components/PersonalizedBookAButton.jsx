import { useCallback, useEffect, useState } from 'react';
import usePdfMake from '@/hooks/use-pdfmake';
import PersonalizedBookA from '@/documents/PersonalizedBookA';
import { useSession } from 'next-auth/react';

export default function PersonalizedBookAButton({ student, group }) {
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

    const docDefinition = PersonalizedBookA(student, group, company);
    if (!docDefinition) return;

    pdfMake.createPdf(docDefinition).open();
  }, [pdfMake, student]);

  return (
    <button onClick={generatePDF} disabled={!pdfMake || !student} className="text-left">
      Индивидуальная книжка первая страница
    </button>
  );
}
