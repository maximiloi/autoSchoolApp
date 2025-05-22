import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';

function ExamGroupChange({ group, setFilterStudents }) {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const initialStudents = group.students.map((s) => ({
      id: s.id,
      groupNumber: group.groupNumber,
      lastName: s.lastName,
      firstName: s.firstName,
      middleName: s.middleName,
      birthDate: s.birthDate,
    }));
    setStudents(initialStudents);
    setFilterStudents(initialStudents);
  }, [group.students, group.groupNumber, setFilterStudents]); // ← зависимости

  const fullName = (lastName, firstName, middleName) => {
    return `${lastName} ${firstName} ${middleName}`;
  };

  const handleDelete = (id) => {
    const updatedStudents = students.filter((s) => s.id !== id);
    setStudents(updatedStudents);
    setFilterStudents(updatedStudents);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>№ группы</TableHead>
          <TableHead>ФИО</TableHead>
          <TableHead>Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.id}>
            <TableCell>{student.groupNumber}</TableCell>
            <TableCell>
              {fullName(student.lastName, student.firstName, student.middleName)}
            </TableCell>
            <TableCell>
              <Button variant="destructive" onClick={() => handleDelete(student.id)}>
                Удалить
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default ExamGroupChange;
