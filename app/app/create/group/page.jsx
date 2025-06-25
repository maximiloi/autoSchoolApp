import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FormCreationTrainingGroup from './components/FormGroup';

export const metadata = {
  title: 'Создание группы | Панель управления компании | Auto School App',
  description: 'Форма для создания новой группы в автошколе.',
};

export default function CreationTrainingGroup() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Создание группы</CardTitle>
        <CardDescription>Заполните форму для добавления новой группы.</CardDescription>
      </CardHeader>
      <CardContent>
        <FormCreationTrainingGroup />
      </CardContent>
    </Card>
  );
}
