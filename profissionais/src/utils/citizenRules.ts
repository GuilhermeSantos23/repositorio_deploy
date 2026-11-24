export interface CitizenFormValues {
  email: string;
  motherName: string;
  fatherName: string;
  susCard: string;
  gender: string;
}

export type CitizenFormErrors = Partial<Record<keyof CitizenFormValues, string>>;

export const GENDER_OPTIONS = ['Feminino', 'Masculino', 'Outro', 'Prefiro não informar'];

/** Obrigatórios: e-mail, nome da mãe e nome do pai. Cartão SUS e gênero são opcionais. */
export function validateCitizenForm(values: CitizenFormValues): CitizenFormErrors {
  const errors: CitizenFormErrors = {};

  if (!values.email.trim()) errors.email = 'Informe o e-mail.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Informe um e-mail válido.';

  if (!values.motherName.trim()) errors.motherName = 'Informe o nome da mãe.';
  if (!values.fatherName.trim()) errors.fatherName = 'Informe o nome do pai.';

  const susDigits = values.susCard.replace(/\D/g, '');
  if (susDigits && susDigits.length !== 15) errors.susCard = 'O Cartão SUS deve ter 15 números.';

  return errors;
}
