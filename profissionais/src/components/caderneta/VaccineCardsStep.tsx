import { Section, FieldError, FieldLabel, inputClass, secondaryButton } from '../aplicacao/Section';
import { RECORTES } from '../../data/vaccinesData';
import { isRecorteAvailableForAge } from '../../utils/ageRules';
import { maskNumeric } from '../../utils/masks';
import { validateCardEntry, type CardEntries, type CardEntry, type CardsByRecorte, type VaccineCard } from '../../utils/vaccineCards';
import { getTodayDateString } from '../../utils/dateRules';
import type { RecorteId } from '../../types/vaccine';

interface Props {
  cards: CardsByRecorte;
  age: number;
  birthDateIso: string;
  entries: CardEntries;
  activeTab: RecorteId;
  showErrors: boolean;
  onTabChange: (id: RecorteId) => void;
  onStatusChange: (key: string, status: CardEntry['status']) => void;
  onFieldChange: (key: string, changes: Partial<CardEntry>) => void;
  onMarkPendingAsNotTaken: (recorteId: RecorteId) => void;
}

function CardRow({
  card, entry, birthDateIso, showErrors, onStatusChange, onFieldChange,
}: {
  card: VaccineCard;
  entry: CardEntry | undefined;
  birthDateIso: string;
  showErrors: boolean;
  onStatusChange: Props['onStatusChange'];
  onFieldChange: Props['onFieldChange'];
}) {
  const errors = entry ? validateCardEntry(entry, birthDateIso, getTodayDateString()) : {};
  const id = (field: string) => `card-${card.key}-${field}`;

  return (
    <li className="rounded-md border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">{card.vacinaNome}</p>
          <p className="text-xs text-gray-600">{card.doseLabel} · {card.momentoLabel}</p>
          {card.note && <p className="mt-1 text-xs text-gray-500">{card.note}</p>}
        </div>
        <div role="group" aria-label={`${card.vacinaNome}, ${card.doseLabel}`} className="flex overflow-hidden rounded-md border border-gray-300">
          {([['aplicada', 'Tomada'], ['nao-realizada', 'Não tomada']] as const).map(([status, label]) => (
            <button
              key={status}
              type="button"
              aria-pressed={entry?.status === status}
              onClick={() => onStatusChange(card.key, status)}
              className={`px-4 py-1.5 text-sm font-medium ${
                entry?.status === status ? 'bg-emerald-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {showErrors && !entry && <FieldError message="Marque se a dose foi tomada ou não." />}

      {entry?.status === 'aplicada' && (
        <div className="mt-4 grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 sm:grid-cols-3">
          <div>
            <FieldLabel htmlFor={id('data')}>Data</FieldLabel>
            <input id={id('data')} type="date" min="1900-01-01" max={getTodayDateString()} value={entry.data ?? ''}
              onChange={(e) => onFieldChange(card.key, { data: e.target.value })} className={inputClass(Boolean(errors.data))} />
            <FieldError message={errors.data} />
          </div>
          <div>
            <FieldLabel htmlFor={id('lote')}>Lote</FieldLabel>
            <input id={id('lote')} value={entry.lote ?? ''} onChange={(e) => onFieldChange(card.key, { lote: e.target.value })} className={inputClass(false)} />
          </div>
          <div>
            <FieldLabel htmlFor={id('unidade')}>Unidade de saúde</FieldLabel>
            <input id={id('unidade')} value={entry.unidade ?? ''} onChange={(e) => onFieldChange(card.key, { unidade: e.target.value })} className={inputClass(false)} />
          </div>
          <div className="sm:col-span-2">
            <FieldLabel htmlFor={id('prof')}>Profissional responsável</FieldLabel>
            <input id={id('prof')} value={entry.profissional ?? ''} onChange={(e) => onFieldChange(card.key, { profissional: e.target.value })} className={inputClass(false)} />
          </div>
          <div>
            <FieldLabel htmlFor={id('cofen')}>Registro profissional (COFEN)</FieldLabel>
            <input id={id('cofen')} inputMode="numeric" value={entry.cofen ?? ''}
              onChange={(e) => onFieldChange(card.key, { cofen: maskNumeric(e.target.value, 6) })} className={inputClass(Boolean(errors.cofen))} />
            <FieldError message={errors.cofen} />
          </div>
          <p className="text-xs text-gray-500 sm:col-span-3">Todos os campos são opcionais: nem toda caderneta antiga os tem legíveis.</p>
        </div>
      )}
    </li>
  );
}

/** Cards de vacina e dose prevista, agrupados por faixa etária. Grupos acima da idade do cidadão ficam bloqueados. */
export default function VaccineCardsStep({
  cards, age, birthDateIso, entries, activeTab, showErrors, onTabChange, onStatusChange, onFieldChange, onMarkPendingAsNotTaken,
}: Props) {
  const activeCards = cards[activeTab];
  const pending = activeCards.filter((card) => !entries[card.key]).length;

  return (
    <Section title="Vacinas previstas">
      <p className="mb-4 text-sm text-gray-600">
        Os cards mostram as doses previstas para a idade do cidadão ({age} anos). Marque cada uma como tomada ou
        não tomada. Doses previstas só passam a constar como aplicadas se forem marcadas como tomadas.
      </p>

      <div className="mb-4 flex flex-wrap gap-1 border-b border-gray-200 pb-2" role="tablist">
        {RECORTES.map((recorte) => {
          const available = isRecorteAvailableForAge(recorte.id, age);
          const total = cards[recorte.id].length;
          const done = cards[recorte.id].filter((card) => entries[card.key]).length;
          return (
            <button
              key={recorte.id}
              type="button"
              role="tab"
              aria-selected={recorte.id === activeTab}
              disabled={!available}
              title={available ? undefined : 'Faixa etária ainda não alcançada pelo cidadão'}
              onClick={() => onTabChange(recorte.id)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                recorte.id === activeTab ? 'bg-emerald-950 text-white'
                  : available ? 'text-gray-700 hover:bg-gray-100' : 'cursor-not-allowed text-gray-400'
              } ${showErrors && available && done < total ? 'ring-1 ring-red-400' : ''}`}
            >
              {recorte.label}{available ? ` (${done}/${total})` : ''}
            </button>
          );
        })}
      </div>

      {pending > 0 && (
        <div className="mb-3 flex justify-end">
          <button type="button" className={secondaryButton} onClick={() => onMarkPendingAsNotTaken(activeTab)}>
            Marcar {pending} pendente{pending > 1 ? 's' : ''} como não tomada{pending > 1 ? 's' : ''}
          </button>
        </div>
      )}

      {activeCards.length === 0 ? (
        <p className="text-sm text-gray-600">Não há doses previstas neste grupo para a idade do cidadão.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {activeCards.map((card) => (
            <CardRow key={card.key} card={card} entry={entries[card.key]} birthDateIso={birthDateIso}
              showErrors={showErrors} onStatusChange={onStatusChange} onFieldChange={onFieldChange} />
          ))}
        </ul>
      )}
    </Section>
  );
}
