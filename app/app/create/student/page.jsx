import StudentForm from './components/StudentForm';

export const metadata = {
  title: 'Создание ученика | Панель управления компании | Auto School App',
  description: 'Форма для создания нового ученика в автошколе.',
};

export default function CreateStudentPage() {
  return (
    <>
      <h2 className="text-lg font-semibold">📋 Создать нового ученика.</h2>
      <StudentForm />
    </>
  );
}
