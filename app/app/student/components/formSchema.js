const { z } = require('zod');

export const formSchema = z.object({
  lastName: z.string().min(2, 'Введите фамилию'),
  firstName: z.string().min(2, 'Введите имя'),
  phone: z.string().min(10, 'Введите телефон'),
  group: z.string().nonempty('ID группы обязателен'),
  trainingCost: z.string().min(2, 'Введите сумму'),
  birthDate: z.date(),

  middleName: z.string().optional(),
  gender: z.enum(['male', 'female']).optional(),
  snils: z.string().optional(),
  birthPlace: z.string().optional(),
  registrationAddress: z.string().optional(),
  actualAddress: z.string().optional(),
  documentType: z.enum(['passport', 'license']).optional(),
  documentIssuer: z.string().optional(),
  documentCode: z.string().optional(),
  documentSeries: z.string().optional(),
  documentNumber: z.string().optional(),
  documentIssueDate: z.date().optional(),
  medicalSeries: z.string().optional(),
  medicalNumber: z.string().optional(),
  medicalIssueDate: z.date().optional(),
  medicalIssuer: z.string().optional(),
  license: z.string().optional(),
  region: z.string().optional(),
  medicalRestriction: z.string().optional(),
  allowedCategories: z.string().optional(),
});
