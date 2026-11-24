import { Fragment, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import vacmaisLogo from '../../assets/vacmais-logo.png';
import termosDeUso from '../../content/termosDeUso.md?raw';
import politicaPrivacidade from '../../content/politicaPrivacidade.md?raw';

interface DocumentoLegalProps {
  tipo: 'termos' | 'privacidade';
}

// Enquanto houver trechos marcados com [INFORMAÇÃO A CONFIRMAR] nos
// textos, esta faixa avisa que o documento ainda é preliminar. Quando a
// equipe responsável preencher tudo, troque para false.
const MOSTRAR_AVISO_PRELIMINAR = true;

// Mostra **negrito** e destaca os trechos [INFORMAÇÃO A CONFIRMAR ...].
function renderizarTextoInline(texto: string): ReactNode[] {
  const partes = texto.split(/(\*\*[^*]+\*\*|\[INFORMAÇÃO A CONFIRMAR[^\]]*\])/g);

  return partes.map((parte, indice) => {
    if (parte.startsWith('**') && parte.endsWith('**')) {
      return <strong key={indice}>{parte.slice(2, -2)}</strong>;
    }
    if (parte.startsWith('[INFORMAÇÃO A CONFIRMAR')) {
      return (
        <mark key={indice} className="rounded bg-amber-100 px-1 text-amber-900">
          {parte}
        </mark>
      );
    }
    return <Fragment key={indice}>{parte}</Fragment>;
  });
}

// Converte o texto dos arquivos .md (somente títulos, parágrafos, listas
// e negrito, o suficiente para estes documentos) em elementos da tela.
function renderizarDocumento(conteudo: string): ReactNode[] {
  const linhas = conteudo.split(/\r?\n/);
  const elementos: ReactNode[] = [];
  let i = 0;

  while (i < linhas.length) {
    const linha = linhas[i];

    if (linha.trim() === '') {
      i++;
    } else if (linha.startsWith('# ')) {
      elementos.push(
        <h1 key={i} className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {linha.slice(2)}
        </h1>,
      );
      i++;
    } else if (linha.startsWith('## ')) {
      elementos.push(
        <h2 key={i} className="mt-8 text-lg font-bold text-emerald-900 sm:text-xl">
          {linha.slice(3)}
        </h2>,
      );
      i++;
    } else if (linha.startsWith('### ')) {
      elementos.push(
        <h3 key={i} className="mt-5 text-base font-semibold text-gray-900">
          {linha.slice(4)}
        </h3>,
      );
      i++;
    } else if (linha.startsWith('- ')) {
      const itens: string[] = [];
      while (i < linhas.length && linhas[i].startsWith('- ')) {
        itens.push(linhas[i].slice(2));
        i++;
      }
      elementos.push(
        <ul key={i} className="mt-3 list-disc space-y-1 pl-6">
          {itens.map((item, indice) => (
            <li key={indice}>{renderizarTextoInline(item)}</li>
          ))}
        </ul>,
      );
    } else if (/^\d+\. /.test(linha)) {
      const itens: string[] = [];
      while (i < linhas.length && /^\d+\. /.test(linhas[i])) {
        itens.push(linhas[i].replace(/^\d+\. /, ''));
        i++;
      }
      elementos.push(
        <ol key={i} className="mt-3 list-decimal space-y-1 pl-6">
          {itens.map((item, indice) => (
            <li key={indice}>{renderizarTextoInline(item)}</li>
          ))}
        </ol>,
      );
    } else if (linha.startsWith('Versão:')) {
      elementos.push(
        <p key={i} className="mt-2 text-sm text-gray-500">
          {renderizarTextoInline(linha)}
        </p>,
      );
      i++;
    } else {
      elementos.push(
        <p key={i} className="mt-3">
          {renderizarTextoInline(linha)}
        </p>,
      );
      i++;
    }
  }

  return elementos;
}

// Página dos Termos de Uso e da Política de Privacidade, aberta em outra
// aba a partir da tela de Cadastro. Os textos ficam em src/content/*.md.
function DocumentoLegal({ tipo }: DocumentoLegalProps) {
  const conteudo = tipo === 'termos' ? termosDeUso : politicaPrivacidade;

  return (
    <div className="min-h-dvh bg-white">
      <header className="bg-emerald-950 px-6 py-4 text-white sm:px-10">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <img
            src={vacmaisLogo}
            alt="Logo Vac+"
            className="h-9 w-9 rounded-lg object-contain"
          />
          <span className="text-lg font-bold">Vac+</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8 sm:px-10 sm:py-10">
        {MOSTRAR_AVISO_PRELIMINAR && (
          <p className="mb-6 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Versão preliminar: os trechos destacados como [INFORMAÇÃO A
            CONFIRMAR] ainda precisam ser preenchidos pela equipe responsável
            antes da publicação.
          </p>
        )}

        <article
          lang="pt-BR"
          className="text-justify text-sm leading-relaxed text-gray-800 hyphens-auto sm:text-base"
        >
          {renderizarDocumento(conteudo)}
        </article>

        <Link
          to="/cadastro"
          className="mt-10 inline-block text-sm font-medium text-emerald-700 hover:underline"
        >
          Voltar para o cadastro
        </Link>
      </main>
    </div>
  );
}

export default DocumentoLegal;
