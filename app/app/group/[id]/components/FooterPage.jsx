import { Separator } from '@/components/ui/separator';

import ApplicationRegisterNewGroupButton from './ApplicationRegisterNewGroupButton';
import DrivingRecordButton from './DrivingRecordButton';
import InformationForTrafficPoliceButton from './InformationForTrafficPoliceButton';
import JourneyTemplateButton from './JourneyTemplateButton';
import ScheduleTemplateButton from './ScheduleTemplateButton';

export default function FooterPage({ group, company }) {
  return (
    <div className="flex space-x-4 text-sm">
      <div className="flex flex-col gap-4">
        <ApplicationRegisterNewGroupButton group={group} company={company} />
        <InformationForTrafficPoliceButton group={group} company={company} />
      </div>
      <Separator orientation="vertical" />
      <ScheduleTemplateButton group={group} company={company} />
      <Separator orientation="vertical" />
      <JourneyTemplateButton group={group} company={company} />
      <Separator orientation="vertical" />
      <DrivingRecordButton group={group} />
    </div>
  );
}
