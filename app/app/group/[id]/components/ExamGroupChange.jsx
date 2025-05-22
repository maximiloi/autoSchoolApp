import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import debounce from 'lodash.debounce';
import { useEffect, useState } from 'react';

function ExamGroupChange({ group, setFilterStudents }) {
  const [students, setStudents] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState('');

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
  }, [group.students, group.groupNumber, setFilterStudents]);

  const fullName = (lastName, firstName, middleName) => `${lastName} ${firstName} ${middleName}`;

  const handleDelete = (id) => {
    const updated = students.filter((s) => s.id !== id);
    setStudents(updated);
    setFilterStudents(updated);
  };

  const handleAdd = (student) => {
    const alreadyExists = students.some((s) => s.id === student.id);
    if (!alreadyExists) {
      const updated = [
        ...students,
        {
          id: student.id,
          groupNumber: student.group?.groupNumber || 'неизвестно',
          lastName: student.lastName,
          firstName: student.firstName,
          middleName: student.middleName,
          birthDate: student.birthDate,
        },
      ];
      setStudents(updated);
      setFilterStudents(updated);

      setSearchResults((prev) => prev.filter((s) => s.id !== student.id));
    }
  };
  const debouncedSearch = debounce(async (term) => {
    if (term.length < 2) return setSearchResults([]);
    try {
      const res = await fetch(
        `/api/search-students?q=${encodeURIComponent(term)}&companyId=${group.companyId}&groupId=${group.id}`,
      );
      const data = await res.json();
      setSearchResults(data);
    } catch (e) {
      console.error('Ошибка поиска:', e);
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(query);
    return () => debouncedSearch.cancel();
  }, [query]);

  return (
    <div className="relative flex h-[50vh] flex-col gap-4">
      <Input placeholder="Поиск по ФИО" value={query} onChange={(e) => setQuery(e.target.value)} />

      {searchResults.length > 0 && (
        <div className="absolute left-0 right-0 top-12 z-20 max-h-40 overflow-auto rounded bg-muted p-2 shadow-md">
          {searchResults.map((s) => (
            <div key={s.id} className="mb-1 flex items-center justify-between">
              <span>{fullName(s.lastName, s.firstName, s.middleName)}</span>
              <Button onClick={() => handleAdd(s)} size="sm">
                Добавить
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="z-10 flex-1 overflow-hidden rounded border">
        <Table className="w-full">
          <TableHeader className="sticky top-0 z-10 bg-white">
            <TableRow>
              <TableHead>№ группы</TableHead>
              <TableHead>ФИО</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
        <div className="h-[calc(50vh-6.5rem)] overflow-y-auto">
          <Table className="w-full">
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
        </div>
      </div>
    </div>
  );
}

export default ExamGroupChange;
