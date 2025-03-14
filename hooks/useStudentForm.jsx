import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { DOCUMENT_MASKS } from '@/app/app/student/components/documentMasks';
import { formSchema } from '@/app/app/student/components/formSchema';

export function useStudentForm(student) {
  const [sameAddress, setSameAddress] = useState(false);
  const { watch, reset, setValue, getValues, ...form } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentNumber: '',
      lastName: '',
      firstName: '',
      phone: '',
      group: '',
      trainingCost: '',
      birthDate: undefined,
      middleName: '',
      gender: '',
      snils: '',
      birthPlace: '',
      registrationAddress: '',
      actualAddress: '',
      documentType: 'passport',
      documentIssuer: '',
      documentCode: '',
      documentSeries: '',
      documentNumber: '',
      documentIssueDate: undefined,
      medicalSeries: '',
      medicalNumber: '',
      medicalIssueDate: undefined,
      medicalIssuer: '',
      licenseSeries: '',
      license: '',
      region: '',
      medicalRestriction: '',
      allowedCategories: '',
    },
  });

  const registrationAddress = watch('registrationAddress');
  const documentType = watch('documentType');

  useEffect(() => {
    if (sameAddress) {
      setValue('actualAddress', getValues('registrationAddress'));
    }
  }, [registrationAddress, sameAddress]);

  useEffect(() => {
    if (documentType && DOCUMENT_MASKS[documentType]) {
      setValue('documentSeries', '');
      setValue('documentNumber', '');
      setValue('documentCode', '');
    }
  }, [documentType]);

  useEffect(() => {
    if (student) {
      reset({ ...student, documentType: student.documentType || 'passport' });
    }
  }, [student]);

  return { reset, form, watch, setValue, getValues, sameAddress, setSameAddress };
}
