import DropdownField from '@/components/ui/DropdownField';
import createObjectActiveGroup from '@/lib/createObjectActiveGroup';

export default function GroupSelection({ control, activeGroups, loading, error }) {
  if (loading) return <span>Загрузка...</span>;
  if (error) return <span>Ошибка: {error}</span>;

  return (
    <div className="mt-4 flex gap-4">
      <DropdownField
        name="group"
        label="Выберете номер группы"
        control={control}
        options={createObjectActiveGroup(activeGroups)}
      />
    </div>
  );
}
