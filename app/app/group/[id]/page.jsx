import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getGroupTitle(id) {
  const group = await prisma.group.findUnique({
    where: { id },
    select: { groupNumber: true },
  });

  return group?.groupNumber || id;
}

export async function generateMetadata({ params }) {
  const title = await getGroupTitle(params.id);

  return {
    title: `Группа № ${title} | Панель управления компании | Auto School App`,
    description: `Страница группы №${title}`,
  };
}

import GroupPage from './GroupPage';

export default function Page() {
  return <GroupPage />;
}
