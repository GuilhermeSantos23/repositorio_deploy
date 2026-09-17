import type { SensitiveCondition } from './vaccine';

export interface Patient {
  cpfDigits: string;
  cpfFormatted: string;
  name: string;
  birthDate: string;
  age: number;
  hasCaderneta: boolean;
  sensitiveCondition?: SensitiveCondition;
  susCard?: string;
  motherName?: string;
  fatherName?: string;
}
