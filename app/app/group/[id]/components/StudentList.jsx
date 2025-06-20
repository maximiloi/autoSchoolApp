'use client';

import { differenceInYears, format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  FileUser,
  RussianRuble,
  Send,
  ShieldPlus,
  Stethoscope,
  UserRoundMinus,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Hint } from '@/components/ui/Hint';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useToast } from '@/hooks/use-toast';
import { useGroupStore } from '@/store/useStore';

import StudentCertificateIssueModalDialog from './modals/StudentCertificateIssueModalDialog';
import StudentDeleteModalDialog from './modals/StudentDeleteModalDialog';
import StudentMedicalCertificateModalDialog from './modals/StudentMedicalCertificateModalDialog';
import StudentPaymentModalDialog from './modals/StudentPaymentModalDialog';

import ButtonsGroupDocuments from './ButtonsGroupDocuments';
import ButtonsGroupReminder from './ButtonsGroupReminder';
import QrcodePopover from './QrcodePopover';

export default function StudentList() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isCertificateDialogOpen, setIsCertificateDialogOpen] = useState(false);
  const [isMedicalDialogOpen, setIsMedicalDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  const { group, setGroup } = useGroupStore();
  const toast = useToast();

  const fetchGroupData = async () => {
    try {
      const response = await fetch(`/api/group/${group.id}`);
      if (!response.ok) throw new Error('Ошибка загрузки данных о группе');

      const updatedGroup = await response.json();
      setGroup(updatedGroup);
    } catch (error) {
      toast({ variant: 'destructive', description: `Ошибка обновления: ${error.message}` });
    }
  };

  const handleDelete = async () => {
    if (!selectedStudent) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/student/${selectedStudent.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Ошибка при удалении');

      setIsDeleteDialogOpen(false);
      fetchGroupData();
    } catch (error) {
      toast({ variant: 'destructive', description: `Ошибка удаления: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const userRole = session?.user?.role || 'USER';

  if (!group.students || group.students.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-lg text-gray-600">В группе пока нет учеников</p>
        <Button asChild>
          <Link href="/app/student">Добавить ученика</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]"></TableHead>
            <TableHead className="w-[40px]"></TableHead>
            <TableHead className="w-[20px]">#</TableHead>
            <TableHead className="w-[200px]">ФИО</TableHead>
            <TableHead className="w-[145px]">Дата рождения</TableHead>
            <TableHead className="w-[80px]">Мед. Справка</TableHead>
            <TableHead className="w-[80px]">Выдача Сви-ва</TableHead>
            <TableHead className="w-[80px]">Оплата</TableHead>
            <TableHead className="w-[80px]">Документы</TableHead>
            {userRole.toUpperCase() === 'DIRECTOR' && (
              <TableHead className="w-[80px]">Напоминание</TableHead>
            )}
            <TableHead className="text-right">Удалить</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {group.students
            .slice()
            .sort((a, b) => a.studentNumber - b.studentNumber)
            .map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <Hint tooltip="Редактировать информацию о студенте">
                    <Button variant="ghost" size="icon">
                      <Link href={`/app/student/${student.id}`}>
                        <FileUser />
                      </Link>
                    </Button>
                  </Hint>
                </TableCell>
                <TableCell className="pt-4">
                  {student.telegramId ? (
                    <Hint tooltip="Студент подписан на телеграм бот">
                      <Send className="h-5 w-5 text-lime-600" />
                    </Hint>
                  ) : (
                    <Hint tooltip="Показать qr-code телеграмм бота">
                      <QrcodePopover student={student} />
                    </Hint>
                  )}
                </TableCell>
                <TableCell>{student.studentNumber}</TableCell>
                <TableCell className="font-medium">
                  {student.lastName} {student.firstName}{' '}
                  {student.middleName ? `${student.middleName.charAt(0)}.` : ''}
                </TableCell>
                <TableCell
                  className={
                    differenceInYears(
                      new Date(group.startTrainingDate),
                      new Date(student.birthDate),
                    ) < 18
                      ? 'text-red-500'
                      : ''
                  }
                >
                  {format(new Date(student.birthDate), 'dd/MM/yyyy', { locale: ru })}
                </TableCell>
                <TableCell>
                  <Hint tooltip="Данные о медицинской справки">
                    <Button
                      variant="outline"
                      size="icon"
                      className={`${
                        !student.medicalSeries ||
                        !student.medicalNumber ||
                        !student.medicalIssuer ||
                        !student.medicalIssueDate ||
                        !student.license ||
                        !student.licenseSeries ||
                        !student.region
                          ? 'bg-red-200 hover:bg-red-300'
                          : 'bg-green-200 hover:bg-green-300'
                      }`}
                      onClick={() => {
                        setSelectedStudent(student);
                        setIsMedicalDialogOpen(true);
                      }}
                    >
                      <Stethoscope />
                    </Button>
                  </Hint>
                </TableCell>
                <TableCell>
                  <Hint tooltip="Указать данные свидетельства об окончании учебы">
                    <Button
                      variant="outline"
                      size="icon"
                      className={`${
                        !student.certificateNumber || !student.certificateIssueDate
                          ? 'bg-red-200 hover:bg-red-300'
                          : 'bg-green-200 hover:bg-green-300'
                      }`}
                      onClick={() => {
                        setSelectedStudent(student);
                        setIsCertificateDialogOpen(true);
                      }}
                    >
                      <ShieldPlus />
                    </Button>
                  </Hint>
                </TableCell>
                <TableCell>
                  <Hint tooltip="Добавить платеж за обучение">
                    <Button
                      variant="outline"
                      size="icon"
                      className={`${
                        Number(student.trainingCost) >
                        (student?.payments?.reduce(
                          (sum, payment) => sum + Number(payment.amount),
                          0,
                        ) || 0)
                          ? 'bg-red-200 hover:bg-red-300'
                          : 'bg-green-200 hover:bg-green-300'
                      }`}
                      onClick={() => {
                        setSelectedStudent(student);
                        setIsPaymentDialogOpen(true);
                      }}
                    >
                      <RussianRuble />
                    </Button>
                  </Hint>
                </TableCell>
                <TableCell>
                  <Hint tooltip="Печать персональных документов">
                    <ButtonsGroupDocuments student={student} />
                  </Hint>
                </TableCell>
                {userRole.toUpperCase() === 'DIRECTOR' && (
                  <TableCell>
                    <ButtonsGroupReminder student={student} />
                  </TableCell>
                )}
                <TableCell className="text-right">
                  <Hint tooltip="Удаление студента">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setSelectedStudent(student);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <UserRoundMinus />
                    </Button>
                  </Hint>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <StudentDeleteModalDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={handleDelete}
        student={selectedStudent}
        loading={loading}
      />

      <StudentPaymentModalDialog
        isOpen={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        student={selectedStudent}
        loading={loading}
        onPaymentSuccess={fetchGroupData}
      />

      <StudentCertificateIssueModalDialog
        isOpen={isCertificateDialogOpen}
        onClose={() => setIsCertificateDialogOpen(false)}
        student={selectedStudent}
        loading={loading}
        onSuccess={fetchGroupData}
      />

      <StudentMedicalCertificateModalDialog
        isOpen={isMedicalDialogOpen}
        onClose={() => setIsMedicalDialogOpen(false)}
        student={selectedStudent}
        loading={loading}
        onSuccess={fetchGroupData}
      />
    </>
  );
}
