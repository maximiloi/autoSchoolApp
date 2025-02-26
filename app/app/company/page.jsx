'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import CompanyForm from './tabs/company';
import TeachersTable from './tabs/TeachersTable';
import TeachersForm from './tabs/TeachersForm';
import CarTable from './tabs/car-table';
import CarForm from './tabs/car';

export default function companyInfo() {
  const [teachers, setTeachers] = useState([]);

  return (
    <Tabs defaultValue="companyTab" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="companyTab">Реквизиты</TabsTrigger>
        <TabsTrigger value="teachersTab">Преподаватели</TabsTrigger>
        <TabsTrigger value="autoTab">Автомобили</TabsTrigger>
      </TabsList>
      <TabsContent value="companyTab">
        <Card>
          <CardHeader>
            <CardTitle>Реквизиты организации</CardTitle>
          </CardHeader>
          <CardContent>
            <CompanyForm />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="teachersTab">
        <Card>
          <CardHeader>
            <CardTitle>Преподаватели организации</CardTitle>
          </CardHeader>
          <CardContent>
            <TeachersTable teachers={teachers} setTeachers={setTeachers} />
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Добавить или редактировать преподавателя</AccordionTrigger>
                <AccordionContent>
                  <TeachersForm setTeachers={setTeachers} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="autoTab">
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
