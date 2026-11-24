import type { ReactNode } from 'react';
import type { CadernetaCitizen } from '../../types/caderneta';
import { calculateAge } from '../../utils/ageRules';

import BookletPage from './BookletPage';

interface IdentificationPageProps {
  citizen: CadernetaCitizen;
  footerLabel: string;
  pageNumber: number;
  totalPages: number;
  issuedAt: Date;
  /** Doses que o profissional marcou como não tomadas (não são aplicações). */
  notTakenCount: number;
}

function Field({ label, value, wide }: { label: string; value: ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? 'bk-field bk-field--wide' : 'bk-field'}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export default function IdentificationPage({
  citizen,
  footerLabel,
  pageNumber,
  totalPages,
  issuedAt,
  notTakenCount,
}: IdentificationPageProps) {
  const notInformed = 'Não informado';

  return (
    <BookletPage footerLabel={footerLabel} pageNumber={pageNumber} totalPages={totalPages}>
      <div className="bk-section">
        <h2>Identificação do cidadão</h2>
      </div>

      <dl className="bk-form">
        <Field wide label="Nome completo" value={citizen.name} />
        <Field label="CPF" value={citizen.cpf} />
        <Field label="Cartão Nacional de Saúde (SUS)" value={citizen.susCard || notInformed} />
        <Field label="Data de nascimento" value={citizen.birthDate} />
        <Field label="Idade" value={`${calculateAge(citizen.birthDate)} anos`} />
        <Field label="Nome da mãe" value={citizen.motherName || notInformed} />
        <Field label="Nome do pai" value={citizen.fatherName || notInformed} />
      </dl>

      <h3 className="bk-subtitle">Informações complementares</h3>
      <dl className="bk-form">
        <Field wide label="Condição sensível" value={citizen.sensitiveCondition || 'Não informada'} />
        <Field wide label="Doses previstas sem registro de aplicação" value={notTakenCount} />
      </dl>

      <p className="bk-note">Emitido em {issuedAt.toLocaleDateString('pt-BR')}.</p>
    </BookletPage>
  );
}
