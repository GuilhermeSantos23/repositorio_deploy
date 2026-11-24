import { useState } from 'react';
import { DownOutlined, RightOutlined } from '@ant-design/icons';

export interface ItemVacina {
  id: string;
  nome: string;
  info: string;
}

interface CartaoVacinasProps {
  titulo: string;
  itens: ItemVacina[];
  // "atraso" deixa o nome das vacinas em vermelho para chamar a atenção.
  variante?: 'normal' | 'atraso';
  // Quando true e houver mais de 3 vacinas, mostra o link "Ver mais" no
  // canto do card.
  comVerMais?: boolean;
  textoVazio: string;
  // Atraso na animação de entrada (para os cards aparecerem em sequência).
  atrasoAnimacao?: number;
}

const QUANTIDADE_INICIAL = 3;

// Card de uma seção do Histórico Vacinal (Próximas, Pendentes ou Em
// atraso). Mostra até 3 vacinas lado a lado. Com "Ver mais", clicar no
// link abre todas as vacinas uma embaixo da outra, com barra de rolagem.
function CartaoVacinas({
  titulo,
  itens,
  variante = 'normal',
  comVerMais = false,
  textoVazio,
  atrasoAnimacao = 0,
}: CartaoVacinasProps) {
  const [expandido, setExpandido] = useState(false);
  const emAtraso = variante === 'atraso';
  const temMais = comVerMais && itens.length > QUANTIDADE_INICIAL;

  function renderItem(item: ItemVacina) {
    return (
      <div key={item.id}>
        <p
          className={`text-sm font-semibold ${
            emAtraso ? 'text-red-600' : 'text-gray-900'
          }`}
        >
          {item.nome}
        </p>
        <p className="mt-1 text-xs text-gray-500">{item.info}</p>
      </div>
    );
  }

  return (
    <section
      style={{ animationDelay: `${atrasoAnimacao}ms` }}
      className="animate-[fade-in-up_0.45s_ease-out_both] rounded-lg border border-gray-100 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold tracking-wide text-gray-800">
          {titulo}
        </h2>

        {temMais && (
          <button
            type="button"
            onClick={() => setExpandido(!expandido)}
            className="flex items-center gap-2 text-sm font-medium text-slate-800 hover:underline"
          >
            {expandido ? 'Ver menos' : 'Ver mais'}
            {expandido ? (
              <UpOutlinedIcon />
            ) : (
              <RightOutlined className="text-xs" />
            )}
          </button>
        )}
      </div>

      {itens.length === 0 && (
        <p className="mt-4 text-sm text-gray-500">{textoVazio}</p>
      )}

      {itens.length > 0 && !expandido && (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {itens.slice(0, QUANTIDADE_INICIAL).map(renderItem)}
        </div>
      )}

      {itens.length > 0 && expandido && (
        <div className="mt-4 flex max-h-72 flex-col gap-4 overflow-y-auto pr-2">
          {itens.map(renderItem)}
        </div>
      )}
    </section>
  );
}

// Seta para cima do "Ver menos" (mesmo tamanho da seta do "Ver mais").
function UpOutlinedIcon() {
  return <DownOutlined className="rotate-180 text-xs" />;
}

export default CartaoVacinas;
