'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

export default function TeachersTable() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    async function fetchTeachers() {
      try {
        const response = await fetch('/api/teacher');
        if (!response.ok) throw new Error('Ошибка загрузки преподавателей');
        const data = await response.json();
        setTeachers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTeachers();
  }, []);

  const handleSort = () => {
    const sorted = [...teachers].sort((a, b) =>
      sortOrder === 'asc'
        ? a.activityType.localeCompare(b.activityType)
        : b.activityType.localeCompare(a.activityType),
    );
    setTeachers(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (teachers.length === 0) return <p>Добавь преподавателя</p>;

  return (
    <>
      <div className="grid grid-cols-2 gap-8">
        <h2 className="mb-4 text-lg font-semibold">👨‍🏭 Список преподавателей и мастеров</h2>
        <Button onClick={handleSort} className="mb-4">
          Сортировать по виду деятельности ({sortOrder === 'asc' ? '▲' : '▼'})
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Фамилия</TableHead>
            <TableHead>Инициалы</TableHead>
            <TableHead>Вид деятельности</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.map((teacher) => (
            <TableRow key={teacher.id}>
              <TableCell>{teacher.lastName}</TableCell>
              <TableCell>
                {teacher.firstName[0]}. {teacher.middleName ? teacher.middleName[0] + '.' : ''}
              </TableCell>
              <TableCell>
                {teacher.activityType === 'theory'
                  ? 'Преподаватель теории'
                  : 'Преподаватель практики'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
