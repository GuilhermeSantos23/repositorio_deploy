import type { ReactNode } from 'react';

interface BookletPageProps {
  /** Texto curto do rodapé, à esquerda (identifica o cidadão). */
  footerLabel: string;
  pageNumber: number;
  totalPages: number;
  children: ReactNode;
}

/** Folha A4 com cabeçalho, área de conteúdo e rodapé numerado. */
export default function BookletPage({
  footerLabel,
  pageNumber,
  totalPages,
  children,
}: BookletPageProps) {
  return (
    <section className="bk-page" lang="pt-BR">
      <header className="bk-page__header">
        <span className="bk-wordmark">Vac+</span>
        <span>Caderneta de Vacinação</span>
      </header>

      <div className="bk-page__body">{children}</div>

      <footer className="bk-page__footer">
        <span>{footerLabel}</span>
        <span>
          Página {pageNumber} de {totalPages}
        </span>
      </footer>
    </section>
  );
}
