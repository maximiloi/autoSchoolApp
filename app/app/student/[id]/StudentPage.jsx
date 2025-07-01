'use client';

import { toast } from '@/hooks/use-toast';
import transformedNullAndStringDate from '@/lib/transformedNullAndStringDate';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import StudentForm from '../../create/student/components/StudentForm';

export default function EditStudentPage() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    async function fetchStudent() {
      setLoading(true);
      try {
        const response = await fetch(`/api/student/${id}`);

        if (response.ok) {
          const data = await response.json();
          if (isMounted) setStudent(transformedNullAndStringDate(data));
        } else {
          throw new Error('Ошибка загрузки данных');
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных о студенте', error.message);
        toast({
          duration: 2000,
          variant: 'destructive',
          description: 'Ошибка при загрузке данных студента',
        });
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchStudent();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <p>Загрузка...</p>;
  }

  return (
    <>
      <h2 className="text-lg font-semibold">✏️ Редактировать данные ученика.</h2>
      <StudentForm student={student} />
    </>
  );
}
