import BookletPage from './BookletPage';

interface ColophonPageProps {
  footerLabel: string;
  pageNumber: number;
  totalPages: number;
}

/** Última folha (folha de rosto): título centralizado e texto corrido justificado. */
export default function ColophonPage({ footerLabel, pageNumber, totalPages }: ColophonPageProps) {
  return (
    <BookletPage footerLabel={footerLabel} pageNumber={pageNumber} totalPages={totalPages}>
      <div className="bk-section">
        <h2>Folha de rosto</h2>
      </div>

      <div className="bk-colophon__title">
        <p>Vac+</p>
        <h2>Caderneta de Vacinação Digital</h2>
      </div>

      <div className="bk-colophon__text">
        <p>
          As informações apresentadas nesta caderneta são destinadas ao acompanhamento dos registros
          de vacinação do cidadão e devem ser tratadas de forma responsável, respeitando os
          princípios de privacidade, segurança e proteção de dados pessoais.
        </p>
        <p>
          O acesso às informações deve ocorrer exclusivamente por usuários autorizados, evitando seu
          compartilhamento, divulgação ou utilização para finalidades diferentes das previstas pelo
          sistema.
        </p>
        <p>
          Esta caderneta digital constitui uma representação desenvolvida pelo grupo Vac+, como parte
          de um projeto acadêmico voltado à demonstração de uma solução para gerenciamento e
          acompanhamento da vacinação. Não se trata de documento oficial emitido por órgão público
          de saúde.
        </p>
        <p>
          O grupo Vac+ agradece a confiança e reforça seu compromisso com a organização, segurança e
          responsabilidade no tratamento das informações apresentadas pelo sistema.
        </p>
      </div>
    </BookletPage>
  );
}
