import prisma from '@/lib/prisma';

async function getGroupTitle(id) {
  const group = await prisma.group.findUnique({
    where: { id },
    select: { groupNumber: true },
  });

  return group?.groupNumber || id;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const title = await getGroupTitle(id);

  return {
    title: `Группа № ${title} | Панель управления компании | Auto School App`,
    description: `Страница группы №${title}`,
  };
}

import GroupPage from './GroupPage';

export default async function Page({ params }) {
  const { id } = await params;
  return <GroupPage id={id} />;
}
