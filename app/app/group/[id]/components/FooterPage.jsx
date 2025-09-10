import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { NotebookText } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useMemo } from 'react';

import ExamListsButton from './buttons/ExamListsButton';
import FDROButton from './buttons/FRDOButton';
import InformationForTrafficPoliceButton from './buttons/InformationForTrafficPoliceButton';
import JourneyPracticeButton from './buttons/JourneyPracticeButton';
import JourneyTemplateButton from './buttons/JourneyTemplateButton';
import ListGroupButton from './buttons/ListGroupButton';
import POButton from './buttons/POButton';
import PracticePlanningButton from './buttons/PracticePlanningButton';
import PrintPracticeButton from './buttons/PrintPracticeButton';
import RegisterNewGroupButton from './buttons/RegisterNewGroupButton';
import ScheduleTemplateButton from './buttons/ScheduleTemplateButton';
import TravelSheetButton from './buttons/TravelSheetButton';

export default function FooterPage({ group, company }) {
  const { data: session } = useSession();

  const isDirector = useMemo(
    () => (session?.user?.role?.toUpperCase?.() ?? '') === 'DIRECTOR',
    [session],
  );

  return (
    <div className="flex space-x-4 text-sm">
      <div className="flex flex-col gap-4">
        <RegisterNewGroupButton group={group} company={company} />
        <InformationForTrafficPoliceButton group={group} company={company} />
        <ListGroupButton group={group} company={company} />
        <ExamListsButton group={group} company={company} />
        <TravelSheetButton group={group} />
      </div>
      {isDirector && (
        <>
          <Separator orientation="vertical" />
          <div className="flex flex-col gap-4">
            <POButton />
            <FDROButton />
          </div>
        </>
      )}
      <Separator orientation="vertical" />
      <div className="flex flex-col gap-4">
        <ScheduleTemplateButton group={group} company={company} />
        <JourneyTemplateButton group={group} company={company} />
        <JourneyPracticeButton group={group} />
      </div>
      <Separator orientation="vertical" />
      <div className="flex flex-col gap-4">
        <PracticePlanningButton group={group} />
        <Link href={`/app/group/${group.id}/driving-schedule-new`}>
          <Button variant="secondary" className="w-full">
            <NotebookText /> Учет практики NEW
          </Button>
        </Link>
        <PrintPracticeButton group={group} />
      </div>
    </div>
  );
}
