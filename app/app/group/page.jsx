import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FormCreationTrainingGroup from './components/FormGroup';

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
