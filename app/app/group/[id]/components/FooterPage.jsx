import { Separator } from '@/components/ui/separator';

import InformationForTrafficPoliceButton from './InformationForTrafficPoliceButton';
import ScheduleTemplateButton from './ScheduleTemplateButton';

export default function FooterPage({ group, company }) {
  return (
    <div className="flex h-5 items-center space-x-4 text-sm">
      <InformationForTrafficPoliceButton group={group} company={company} />
      <Separator orientation="vertical" />
      <ScheduleTemplateButton group={group} company={company} />
    </div>
  );
}
