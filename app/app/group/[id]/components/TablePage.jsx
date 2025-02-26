'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CarFront, FileUser, NotepadText, UserRoundMinus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import StudentDeleteModalDialog from './StudentDeleteModalDialog';
import ZayavlenieAnketaButton from '@/documents/zayavlenie-anketa';

export default function TablePage({ group }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!selectedStudent) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/student/${selectedStudent.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Ошибка при удалении');
      }

      group.students = group.students.filter((s) => s.id !== selectedStudent.id);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Ошибка удаления:', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!group.students || group.students.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-lg text-gray-600">В группе пока нет учеников</p>
        <Button asChild>
          <Link href="/app/student">Добавить ученика</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]"></TableHead>
            <TableHead className="w-[20px]">#</TableHead>
            <TableHead className="w-[200px]">ФИО</TableHead>
            <TableHead className="w-[145px]">Дата рождения</TableHead>
            <TableHead className="w-[80px]">Документы</TableHead>
            <TableHead className="w-[80px]">Вождение</TableHead>
            <TableHead className="text-right">Удалить</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {group.students.map((student, index) => (
            <TableRow key={student.id}>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <Link href={`/app/student/${student.id}`}>
                    <FileUser />
                  </Link>
                </Button>
              </TableCell>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="font-medium">
                {student.lastName} {student.firstName}{' '}
                {student.middleName ? `${student.middleName.charAt(0)}.` : ''}
              </TableCell>
              <TableCell>
                {format(new Date(student.birthDate), 'dd/MM/yyyy', { locale: ru })}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <NotepadText />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Документы</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <ZayavlenieAnketaButton student={student} />
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="icon">
                  <CarFront />
                </Button>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setSelectedStudent(student);
                    setIsDialogOpen(true);
                  }}
                >
                  <UserRoundMinus />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <StudentDeleteModalDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onDelete={handleDelete}
        student={selectedStudent}
        loading={loading}
      />
    </>
  );
}
