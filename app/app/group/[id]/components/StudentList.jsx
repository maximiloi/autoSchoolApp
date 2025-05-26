'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { differenceInYears, format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  FileUser,
  MessageSquareReply,
  NotepadText,
  RussianRuble,
  ShieldPlus,
  UserRoundMinus,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import StudentDeleteModalDialog from './StudentDeleteModalDialog';
import StudentPaymentModalDialog from './StudentPaymentModalDialog';

import ApplicationFormButton from './ApplicationFormButton';
import BasicContractButton from './BasicContractButton';
import DriverCardButton from './DriverCardButton';
import ParentalStatementButton from './ParentalStatementButton';
import PersonalizedBookAButton from './PersonalizedBookAButton';
import PersonalizedBookBButton from './PersonalizedBookBButton';
import StudentCertificateIssueModalDialog from './StudentCertificateIssueModalDialog';
import WhatsAppButton from './WhatsAppButton';

export default function StudentList({ company }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isCertificateDialogOpen, setIsCertificateDialogOpen] = useState(false);
  const { group, setGroup } = useGroupStore();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
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
            <TableHead className="w-[20px]">#</TableHead>
            <TableHead className="w-[200px]">ФИО</TableHead>
            <TableHead className="w-[145px]">Дата рождения</TableHead>
            <TableHead className="w-[80px]">Выдача Сви-ва</TableHead>
            <TableHead className="w-[80px]">Оплата</TableHead>
            <TableHead className="w-[80px]">Документы</TableHead>
            <TableHead className="w-[80px]">Напоминание</TableHead>
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
                  <Button variant="ghost" size="icon">
                    <Link href={`/app/student/${student.id}`}>
                      <FileUser />
                    </Link>
                  </Button>
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
                  <Button
                    variant="outline"
                    size="icon"
                    className={`${
                      student.certificateNumber === null && student.certificateIssueDate === null
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
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <NotepadText />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Документы</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <ApplicationFormButton student={student} />
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BasicContractButton student={student} group={group} company={company} />
                        </DropdownMenuItem>
                        {differenceInYears(
                          new Date(group.startTrainingDate),
                          new Date(student.birthDate),
                        ) < 18 && (
                          <DropdownMenuItem>
                            <ParentalStatementButton student={student} />
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <PersonalizedBookAButton
                            student={student}
                            group={group}
                            company={company}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <PersonalizedBookBButton group={group} />
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <DriverCardButton student={student} company={company} />
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MessageSquareReply />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Отправка сообщений в WhatsApp</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <WhatsAppButton student={student} />
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="text-right">
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
    </>
  );
}
