'use client';

import { BookUser, Loader2 } from 'lucide-react';
import { useState } from 'react';

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

import { useCompanyStore } from '@/store/useStore';

export default function FDROButton() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [loading, setLoading] = useState(false);
  const { company } = useCompanyStore();
  const { createdAt } = company || {};

  const handleDialogOpenChange = (open) => {
    setDialogOpen(open);
  };

  const handleDialogCancelButtonChange = () => {
    setDialogOpen(false);
  };

  const downloadFile = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/export-dpo?year=${selectedYear}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'exported_dpo.xlsx';
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка при экспорте:', error);
    } finally {
      setLoading(false);
      setDialogOpen(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const startYear = createdAt ? new Date(createdAt).getFullYear() : currentYear;
  const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => currentYear - i);

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <BookUser className="mr-2 h-4 w-4" /> Шаблон ФИС ФРДО
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Данные для передачи ФИС ФРДО</DialogTitle>
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
              <Button onClick={downloadFile} disabled={!selectedYear || loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Загрузка...
                  </>
                ) : (
                  'Сформировать документ'
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
