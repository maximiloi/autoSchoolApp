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
import { OctagonX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CarDeleteModalDialog from './CarDeleteModalDialog';

export default function CarTable({ cars, setCars }) {
  const [teachers, setTeachers] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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

  const handleDelete = async () => {
    if (!selectedCar) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/car/${selectedCar.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setCars((prev) => prev.filter((t) => t.id !== selectedCar.id));
      } else {
        throw new Error('Ошибка при удалении');
      }

      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Ошибка удаления:', error.message);
    } finally {
      setLoading(false);
    }
  };

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
            <TableHead>Коробка передач</TableHead>
            <TableHead>Номер автомобиля</TableHead>
            <TableHead>Буквенное обозначение</TableHead>
            <TableHead>Ответственный</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cars.map((car) => (
            <TableRow key={car.id}>
              <TableCell>{car.carModel}</TableCell>
              <TableCell>{car.carTransmission === 'akp' ? 'АКПП' : 'МКПП'}</TableCell>
              <TableCell>{car.carNumber}</TableCell>
              <TableCell>{car.literalMarking}</TableCell>
              <TableCell>{getTeacherName(car.teacherId)}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedCar(car);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <OctagonX />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CarDeleteModalDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        car={selectedCar}
        loading={loading}
        onDelete={handleDelete}
      />
    </>
  );
}
