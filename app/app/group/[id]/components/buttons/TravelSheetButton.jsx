import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import usePdfMake from '@/hooks/use-pdfmake';
import { useCompanyStore } from '@/store/useStore';
import examTravelSheet from '@/templates/examTravelSheet';
import { ru } from 'date-fns/locale';
import { Compass } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export default function TravelSheetButton({ group }) {
  const pdfMake = usePdfMake();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [cars, setCars] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { company } = useCompanyStore();

  useEffect(() => {
    if (dialogOpen) {
      fetch('/api/teacher')
        .then((res) => res.json())
        .then((data) => setTeachers(data))
        .catch((error) => console.error('Ошибка загрузки учителей:', error));
      fetch('/api/car')
        .then((res) => res.json())
        .then((data) => setCars(data))
        .catch((error) => console.error('Ошибка загрузки автомобилей:', error));
    }
  }, [dialogOpen]);

  const handleDialogOpenChange = (open) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedDate(null);
      setSelectedTeacher(null);
      setSelectedCar(null);
      setIsGenerating(false);
    }
  };

  const handleDialogCancelButtonChange = () => {
    setDialogOpen(false);
    setSelectedDate(null);
    setSelectedTeacher(null);
    setSelectedCar(null);
    setIsGenerating(false);
  };

  const generatePDF = useCallback(async () => {
    if (!pdfMake || isGenerating) {
      console.error('pdfMake не загружен или генерация уже выполняется');
      return;
    }

    setIsGenerating(true);
    try {
      const docDefinition = examTravelSheet(
        selectedDate,
        group,
        company,
        selectedTeacher,
        selectedCar,
      );
      if (!docDefinition) return;

      await pdfMake.createPdf(docDefinition).open();
      setDialogOpen(false);
    } catch (error) {
      console.error('Ошибка при генерации PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [pdfMake, group, company, selectedTeacher, selectedCar, isGenerating]);

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" disabled={!pdfMake}>
          <Compass />
          Путевой лист для экзаменов в ГИБДД
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Укажите дату экзамена, ФИО преподавателя и номер авто</DialogTitle>
          <DialogDescription>для группы №{group.groupNumber}</DialogDescription>
        </DialogHeader>

        <Calendar
          locale={ru}
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          initialFocus
        />

        <Select onValueChange={(value) => setSelectedTeacher(teachers.find((t) => t.id === value))}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите преподавателя практики" />
          </SelectTrigger>
          <SelectContent>
            {teachers
              .filter((teacher) => teacher.activityType === 'practice')
              .map((teacher) => (
                <SelectItem key={teacher.id} value={teacher.id}>
                  {teacher.lastName} {teacher.firstName} {teacher.middleName || ''}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => setSelectedCar(cars.find((c) => c.id === value))}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите автомобиль" />
          </SelectTrigger>
          <SelectContent>
            {cars.map((car) => (
              <SelectItem key={car.id} value={car.id}>
                {car.carModel} ({car.carNumber})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Button
              onClick={handleDialogCancelButtonChange}
              variant="ghost"
              disabled={isGenerating}
            >
              Отмена
            </Button>
            <Button
              onClick={generatePDF}
              disabled={
                !pdfMake || !selectedDate || !selectedTeacher || !selectedCar || isGenerating
              }
            >
              {isGenerating ? 'Формирование...' : 'Сформировать путевой лист'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
