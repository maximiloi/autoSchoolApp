import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import CompanyForm from './tabs/company';
import TeachersTable from './tabs/teachers-table';
import TeachersForm from './tabs/teachers';
import CarTable from './tabs/car-table';
import CarForm from './tabs/car';

export default function companyInfo() {
  return (
    <Tabs defaultValue="company" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="company">Реквизиты</TabsTrigger>
        <TabsTrigger value="teachers">Преподаватели</TabsTrigger>
        <TabsTrigger value="auto">Автомобили</TabsTrigger>
      </TabsList>
      <TabsContent value="company">
        <Card>
          <CardHeader>
            <CardTitle>Реквизиты организации</CardTitle>
          </CardHeader>
          <CardContent>
            <CompanyForm />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="teachers">
        <Card>
          <CardHeader>
            <CardTitle>Преподаватели организации</CardTitle>
          </CardHeader>
          <CardContent>
            <TeachersTable />
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Добавить или редактировать преподавателя</AccordionTrigger>
                <AccordionContent>
                  <TeachersForm />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="auto">
        <Card>
          <CardHeader>
            <CardTitle>Автомобили организации</CardTitle>
          </CardHeader>
          <CardContent>
            <CarTable />
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Добавить или редактировать автомобили</AccordionTrigger>
                <AccordionContent>
                  <CarForm />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
