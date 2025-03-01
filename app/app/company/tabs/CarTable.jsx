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

export default function CarTable() {
  const [cars, setCars] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const carResponse = await fetch('/api/car');
        if (!carResponse.ok) throw new Error('Ошибка загрузки автомобилей');
        const carData = await carResponse.json();

        const teacherResponse = await fetch('/api/teacher');
        if (!teacherResponse.ok) throw new Error('Ошибка загрузки преподавателей');
        const teacherData = await teacherResponse.json();

        setCars(carData);
        setTeachers(teacherData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function getTeacherName(teacherId) {
    const teacher = teachers.find((t) => t.id === teacherId);
    return teacher
      ? `${teacher.lastName} ${teacher.firstName[0]}.${teacher.middleName ? teacher.middleName[0] + '.' : ''}`
      : 'Неизвестно';
  }
  if (loading) return <p>Загрузка...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (cars.length === 0) return <p>Добавьте автомобиль</p>;

  return (
    <>
      <div className="grid grid-cols-2 gap-8">
        <h2 className="mb-4 text-lg font-semibold">🚗 Список автомобилей</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Модель автомобиля</TableHead>
            <TableHead>Номер автомобиля</TableHead>
            <TableHead>Буквенное обозначение</TableHead>
            <TableHead>Ответственный</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cars.map((car) => (
            <TableRow key={car.id}>
              <TableCell>{car.carModel}</TableCell>
              <TableCell>{car.carNumber}</TableCell>
              <TableCell>{car.literalMarking}</TableCell>
              <TableCell>{getTeacherName(car.teacherId)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
