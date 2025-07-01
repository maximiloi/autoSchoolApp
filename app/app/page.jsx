export const metadata = {
  title: 'Главная | Панель управления компании | Auto School App',
  description: 'Приложение для управления автошколой',
};

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-2rem)] px-4 py-4">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Программа для работы с автошколами
      </h2>

      <p className="mt-8 text-xl text-muted-foreground">Спасибо, что выбрали наше приложение!</p>
      <p className="text-lg font-semibold">
        Мы надеемся, что оно поможет вам эффективно управлять вашей автошколой.
      </p>
      <p className="mt-4 w-1/2 text-lg">
        Если у вас возникнут вопросы или предложения по улучшению, пожалуйста, не стесняйтесь
        обращаться к нам. Мы всегда рады помочь и готовы выслушать ваши идеи.
      </p>
      <p className="absolute bottom-0 text-lg font-semibold italic">
        С уважением, команда Auto School App.
      </p>
    </div>
  );
}
