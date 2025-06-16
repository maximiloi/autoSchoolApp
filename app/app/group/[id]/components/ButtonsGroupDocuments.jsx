import { differenceInYears } from 'date-fns';
import { NotepadText } from 'lucide-react';

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

import { useGroupStore } from '@/store/useStore';

import ApplicationFormButton from './buttons/ApplicationFormButton';
import BasicContractButton from './buttons/BasicContractButton';
import DriverCardButton from './buttons/DriverCardButton';
import ParentalStatementButton from './buttons/ParentalStatementButton';
import PersonalizedBookAButton from './buttons/PersonalizedBookAButton';
import PersonalizedBookBButton from './buttons/PersonalizedBookBButton';

export default function ButtonsGroupDocuments({ company, student }) {
  const { group } = useGroupStore();

  return (
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
          {differenceInYears(new Date(group.startTrainingDate), new Date(student.birthDate)) <
            18 && (
            <DropdownMenuItem>
              <ParentalStatementButton student={student} />
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <PersonalizedBookAButton student={student} group={group} company={company} />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <PersonalizedBookBButton group={group} student={student} />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DriverCardButton student={student} company={company} />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
