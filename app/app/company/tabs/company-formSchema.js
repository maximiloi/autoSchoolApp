import { z } from 'zod';

export const CompanyFormSchema = z.object({
  companyName: z.string().min(2, 'Введите название компании'),
  shortName: z.string().min(2, 'Введите краткое название'),
  license: z.string().min(2, 'Введите номер лицензии'),
  inn: z
    .string()
    .length(10, 'ИНН должен содержать 10 цифр')
    .regex(/^\d+$/, 'ИНН должен содержать только цифры'),
  kpp: z
    .string()
    .length(9, 'КПП должен содержать 9 цифр')
    .regex(/^\d+$/, 'КПП должен содержать только цифры'),
  ogrn: z
    .union([
      z
        .string()
        .length(13, 'ОГРН должен содержать 13 цифр')
        .regex(/^\d+$/, 'ОГРН должен содержать только цифры'),
      z.literal(''),
    ])
    .optional(),
  legalAddress: z.string().min(5, 'Введите юридический адрес'),
  actualAddress: z.string().min(5, 'Введите фактический адрес').optional().default(''),
  region: z.string().min(2, 'Введите регион'),
  bank: z.string().min(2, 'Введите название банка'),
  account: z
    .string()
    .length(20, 'Расчетный счет должен содержать 20 цифр')
    .regex(/^\d+$/, 'Расчетный счет должен содержать только цифры'),
  bik: z
    .string()
    .length(9, 'БИК должен содержать 9 цифр')
    .regex(/^\d+$/, 'БИК должен содержать только цифры'),
  correspondentAccount: z
    .string()
    .length(20, 'Корр. счет должен содержать 20 цифр')
    .regex(/^\d+$/, 'Корр. счет должен содержать только цифры'),
  directorSurname: z.string().min(2, 'Введите фамилию директора'),
  directorName: z.string().min(2, 'Введите имя директора'),
  directorPatronymic: z.string().min(2, 'Введите отчество директора').optional().default(''),
  accountantSurname: z.string().min(2, 'Введите фамилию бухгалтера').optional().default(''),
  accountantName: z.string().min(2, 'Введите имя бухгалтера').optional().default(''),
  accountantPatronymic: z.string().min(2, 'Введите отчество бухгалтера').optional().default(''),
  phone: z.string().min(10, 'Введите телефон').optional().default(''),
  email: z.string().email('Введите корректный email'),
  website: z.string().url('Введите корректный URL').optional().default(''),
});
