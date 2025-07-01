import prisma from '@/lib/prisma';

async function getStudentName(id) {
  const student = await prisma.student.findUnique({
    where: { id },
    select: { firstName: true, lastName: true },
  });

  return student?.lastName + ' ' + student?.firstName || id;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const title = await getStudentName(id);

  return {
    title: `${title} - Редактирование | Панель управления компании | Auto School App`,
    description: `Страница студента ${title}`,
  };
}

import EditStudentPage from './StudentPage';

export default async function Page({ params }) {
  const { id } = await params;
  return <EditStudentPage id={id} />;
}
