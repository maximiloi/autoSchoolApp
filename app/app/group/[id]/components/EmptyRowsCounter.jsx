import { Button } from '@/components/ui/button';

export default function EmptyRowsCounter({ value, onChange }) {
  const handleAddRow = () => {
    onChange(value + 1);
  };

  return (
    <div className="flex items-center gap-2">
      <Button onClick={handleAddRow}>Добавить пустую строку</Button>
      <span className="text-sm text-muted-foreground">Добавлено: {value}</span>
    </div>
  );
}
