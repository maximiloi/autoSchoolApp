import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CarFront } from 'lucide-react';
import Link from 'next/link';

import ExamListsButton from './buttons/ExamListsButton';
import InformationForTrafficPoliceButton from './buttons/InformationForTrafficPoliceButton';
import JourneyPracticeButton from './buttons/JourneyPracticeButton';
import JourneyTemplateButton from './buttons/JourneyTemplateButton';
import ListGroupButton from './buttons/ListGroupButton';
import PracticePlanningButton from './buttons/PracticePlanningButton';
import PrintPracticeButton from './buttons/PrintPracticeButton';
import RegisterNewGroupButton from './buttons/RegisterNewGroupButton';
import ScheduleTemplateButton from './buttons/ScheduleTemplateButton';

export default function FooterPage({ group, company }) {
  return (
    <div className="flex space-x-4 text-sm">
      <div className="flex flex-col gap-4">
        <ListGroupButton group={group} company={company} />
        <RegisterNewGroupButton group={group} company={company} />
        <ExamListsButton group={group} company={company} />
        <InformationForTrafficPoliceButton group={group} company={company} />
      </div>
      <Separator orientation="vertical" />
      <ScheduleTemplateButton group={group} company={company} />
      <Separator orientation="vertical" />
      <div className="flex flex-col gap-4">
        <JourneyTemplateButton group={group} company={company} />
        <JourneyPracticeButton group={group} />
      </div>
      <Separator orientation="vertical" />
      <div className="flex flex-col gap-4">
        <PracticePlanningButton group={group} />
        <Link href={`/app/group/${group.id}/driving-schedule`}>
          <Button>
            <CarFront /> Учет практики
          </Button>
        </Link>

        <Link href={`/app/group/${group.id}/driving-schedule-new`}>
          <Button>
            <CarFront /> Учет практики NEW
          </Button>
        </Link>

        <PrintPracticeButton group={group} />
      </div>
    </div>
  );
}
