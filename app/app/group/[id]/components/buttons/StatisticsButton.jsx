import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { generateTablePO } from '@/lib/generateTablePO';
import { useCompanyStore } from '@/store/useStore';
import { PersonStanding } from 'lucide-react';
import { useState } from 'react';
import { getStudentsByYear } from '../actions/actions';

export default function StatisticsButton() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { company } = useCompanyStore();
  const { createdAt } = company || {};

  const handleDialogOpenChange = (open) => {
    setDialogOpen(open);
  };

  const handleDialogCancelButtonChange = () => {
    setDialogOpen(false);
  };

  const handleClick = async () => {
    if (selectedYear) {
      setIsLoading(true);
      try {
        const students = await getStudentsByYear(selectedYear);
        console.log('Students for year', selectedYear, ':', students);

        generateTablePO(students, selectedYear);
      } finally {
        setIsLoading(false);
        setDialogOpen(false);
      }
    }
  };

  const currentYear = new Date().getFullYear();
  const startYear = createdAt ? new Date(createdAt).getFullYear() : currentYear;
  const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => currentYear - i);

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PersonStanding /> Данные статистики
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Данные для передачи в Территориальный орган статистики</DialogTitle>
          <DialogDescription>Выберите учебный год</DialogDescription>
        </DialogHeader>

        <Select onValueChange={(value) => setSelectedYear(value)} value={selectedYear}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите год" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DialogFooter>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <Button onClick={handleDialogCancelButtonChange} variant="ghost">
                Отмена
              </Button>
              <Button onClick={handleClick} disabled={!selectedYear || isLoading}>
                {isLoading ? 'Формирование...' : 'Сформировать документ'}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
