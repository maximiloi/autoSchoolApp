'use server';

import prisma from '@/lib/prisma';

export async function getStudentsByYear(year) {
  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31`);

  const groups = await prisma.group.findMany({
    where: {
      AND: [
        {
          startTrainingDate: {
            gte: startDate,
          },
        },
        {
          endTrainingDate: {
            lte: endDate,
          },
        },
      ],
    },
    include: {
      students: {
        select: {
          birthDate: true,
          gender: true,
        },
      },
    },
  });

  const students = groups.flatMap((group) =>
    group.students.map((student) => ({
      birthDate: student.birthDate,
      gender: student.gender,
    })),
  );

  return students;
}
