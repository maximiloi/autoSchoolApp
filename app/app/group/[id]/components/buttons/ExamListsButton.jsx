import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import usePdfMake from '@/hooks/use-pdfmake';
import { ru } from 'date-fns/locale';
import { TableProperties } from 'lucide-react';
import { useCallback, useState } from 'react';

import examListsTemplate from '@/templates/examLists';
import EmptyRowsCounter from '../EmptyRowsCounter';
import ExamGroupChange from '../ExamGroupChange';

export default function ExamListsButton({ group, company }) {
  const pdfMake = usePdfMake();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [modifiedGroup, setModifiedGroup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [emptyRows, setEmptyRows] = useState(0);
  const [examType, setExamType] = useState('');
  const [filterStudents, setFilterStudents] = useState(
    group.students.map((s) => ({
      id: s.id,
      groupNumber: group.groupNumber,
      lastName: s.lastName,
      firstName: s.firstName,
      middleName: s.middleName,
      birthDate: s.birthDate,
      phone: s.phone,
    })),
  );

  const handleDialogOpenChange = (open) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedDate(null);
      setExamType('');
      setModifiedGroup(false);
      setEmptyRows(0);
    }
  };

  const handleDialogCancelButtonChange = () => {
    setDialogOpen(false);
    setSelectedDate(null);
    setExamType('');
    setModifiedGroup(false);
    setEmptyRows(0);
  };

  const generatePDF = useCallback(() => {
    if (!pdfMake) {
      console.error('pdfMake не загружен');
      return;
    }

    const docDefinition = examListsTemplate(
      filterStudents,
      company,
      selectedDate,
      examType,
      emptyRows,
    );
    if (!docDefinition) return;

    pdfMake.createPdf(docDefinition).open();
    setDialogOpen(false);
    setSelectedDate(null);
    setExamType('');
    setModifiedGroup(false);
    setEmptyRows(0);
  }, [pdfMake, selectedDate, filterStudents, company, emptyRows, examType]);

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" disabled={!pdfMake}>
          <TableProperties />
          Заявление для экзаменов в ГИБДД
        </Button>
      </DialogTrigger>
      <DialogContent className={modifiedGroup ? 'max-w-3xl' : 'max-w-xl'}>
        <DialogHeader>
          <DialogTitle>Укажите тип и дату экзамена</DialogTitle>
          <DialogDescription>для группы №{group.groupNumber}</DialogDescription>
        </DialogHeader>

        <RadioGroup value={examType} onValueChange={setExamType}>
          <div className="flex space-x-4">
            <label className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2">
              <RadioGroupItem value="Теория" className="peer" />
              Теория
            </label>

            <label className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2">
              <RadioGroupItem value="Практика" className="peer" />
              Практика
            </label>
          </div>
        </RadioGroup>

        <div className="flex gap-4">
          <Calendar
            locale={ru}
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            initialFocus
          />

          {modifiedGroup && <ExamGroupChange group={group} setFilterStudents={setFilterStudents} />}
        </div>

        <DialogFooter>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <Button onClick={() => handleDialogCancelButtonChange()} variant="ghost">
                Отмена
              </Button>
              <Button onClick={generatePDF} disabled={!pdfMake || !selectedDate || !examType}>
                Сформировать заявление
              </Button>
            </div>
            <Button onClick={() => setModifiedGroup(true)}>Изменить состав сдающих</Button>
            <EmptyRowsCounter value={emptyRows} onChange={setEmptyRows} />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
