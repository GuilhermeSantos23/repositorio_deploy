import type { HistoryItem } from '../../utils/bookletPagination';
import { formatIsoDate } from '../../utils/formatDate';
import BookletPage from './BookletPage';

interface HistoryPageProps {
  items: HistoryItem[];
  /** Posição do primeiro item da página dentro do histórico completo (base 0). */
  firstIndex: number;
  totalItems: number;
  continuation: boolean;
  footerLabel: string;
  pageNumber: number;
  totalPages: number;
}

const NOT_INFORMED = 'Não informado';

function HistoryRow({ item }: { item: HistoryItem }) {
  const { record } = item;
  const extras: string[] = [];

  if (record.condicaoSensivel) extras.push(`Condição sensível: ${record.condicaoSensivel}`);

  return (
    <li data-item className="bk-record">
      <div className="bk-grid bk-record__row">
        <div>{item.number}</div>
        <div>{formatIsoDate(record.data)}</div>
        <div>
          <strong>{record.vacinaNome}</strong>
          <small>
            {record.doseLabel} · {record.momentoLabel}
          </small>
        </div>
        <div>{record.lote || NOT_INFORMED}</div>
        <div>{record.unidade || NOT_INFORMED}</div>
        <div>
          {record.profissional || NOT_INFORMED}
          {record.cofen ? <small>Registro profissional (COFEN): {record.cofen}</small> : null}
        </div>
      </div>

      {extras.length > 0 ? <div className="bk-record__extra">{extras.join(' · ')}</div> : null}
    </li>
  );
}

/** Uma folha do histórico: título, cabeçalho de colunas e os registros que cabem nela. */
export default function HistoryPage({
  items,
  firstIndex,
  totalItems,
  continuation,
  footerLabel,
  pageNumber,
  totalPages,
}: HistoryPageProps) {
  const range =
    items.length > 0
      ? `Registros ${firstIndex + 1} a ${firstIndex + items.length} de ${totalItems}`
      : '';

  return (
    <BookletPage footerLabel={footerLabel} pageNumber={pageNumber} totalPages={totalPages}>
      <div className="bk-section">
        <h2>{continuation ? 'Histórico de vacinação (continuação)' : 'Histórico de vacinação'}</h2>
        <span>{range}</span>
      </div>

      <div className="bk-grid bk-head" aria-hidden="true">
        <div>Nº</div>
        <div>Data</div>
        <div>Vacina e dose</div>
        <div>Lote</div>
        <div>Unidade</div>
        <div>Profissional</div>
      </div>

      <ol className="bk-records">
        {items.map((item) => (
          <HistoryRow key={item.key} item={item} />
        ))}
      </ol>

      {items.length === 0 ? (
        <p className="bk-empty">Nenhuma aplicação registrada para este cidadão.</p>
      ) : null}
    </BookletPage>
  );
}
