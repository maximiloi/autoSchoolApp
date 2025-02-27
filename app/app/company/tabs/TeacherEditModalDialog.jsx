import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import TeachersForm from './TeachersForm';

export default function TeacherEditModalDialog({ isOpen, onClose, teacher, setTeachers }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[70vw] max-w-none">
        <DialogHeader>
          <DialogTitle>Редактирование преподавателя</DialogTitle>
          <DialogDescription>Введите данные преподавателя и сохраните изменения.</DialogDescription>
        </DialogHeader>
        <TeachersForm
          initialData={teacher}
          setTeachers={setTeachers}
          onClose={async () => {
            onClose();
            const response = await fetch('/api/teacher');
            if (response.ok) {
              const updatedTeachers = await response.json();
              setTeachers(updatedTeachers);
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
