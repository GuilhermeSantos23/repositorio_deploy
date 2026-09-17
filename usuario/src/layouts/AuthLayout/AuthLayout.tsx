import type { ReactNode } from 'react';
import vacmaisLogo from '../../assets/vacmais-logo.png';

interface AuthLayoutProps {
  children: ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      {/* Painel institucional */}
      <div className="flex flex-col justify-between gap-10 bg-emerald-950 px-6 py-8 text-white sm:px-10 sm:py-10 lg:w-[45%] lg:px-12 lg:py-12">
        <div>
          <div className="flex items-center gap-2">
            <img
              src={vacmaisLogo}
              alt="Logo Vac+"
              className="h-9 w-9 rounded-lg object-contain"
            />
            <span className="text-lg font-bold">Vac+</span>
          </div>
          <p className="mt-1 text-xs font-semibold tracking-widest text-emerald-300">
            CIDADÃO
          </p>
        </div>

        <h1 className="text-3xl leading-tight font-extrabold sm:text-4xl">
          Controle de
          <br />
          vacinação
          <br />
          <span className="text-emerald-300">inteligente</span> e digital
        </h1>

        <p className="max-w-sm text-sm leading-relaxed text-emerald-100/80">
          O Vac+ é uma plataforma completa para monitoramento e controle de
          vacinações, conectando profissionais de saúde e cidadãos em um
          ecossistema seguro e confiável.
        </p>
      </div>

      {/* Formulário */}
      <div className="flex flex-1 items-center justify-center bg-white px-6 py-10 sm:px-10 lg:w-[55%]">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}

export default AuthLayout;
