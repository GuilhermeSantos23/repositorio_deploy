import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { CadernetaCitizen, VaccinationRecord } from '../../types/caderneta';
import { buildHistoryItems } from '../../utils/bookletPagination';
import CoverPage from './CoverPage';
import IdentificationPage from './IdentificationPage';
import HistoryPage from './HistoryPage';
import ColophonPage from './ColophonPage';
import { useHistoryPages } from './useHistoryPages';
import './booklet.css';

interface Props {
  citizen: CadernetaCitizen;
  /** Abre a janela de impressão assim que a caderneta estiver pronta. */
  autoPrint?: boolean;
  records: VaccinationRecord[];
  onClose: () => void;
}

// A4 em pixels de tela (96 dpi): 210 mm x 296,5 mm.
const PAGE_WIDTH_PX = (210 / 25.4) * 96;
const PAGE_HEIGHT_PX = (296.5 / 25.4) * 96;

/** Reduz a folha em telas estreitas para que ela apareça inteira, sem rolagem horizontal. */
function useSheetScale() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    function update() {
      const available = (stageRef.current?.clientWidth ?? PAGE_WIDTH_PX) - 32;
      setScale(Math.min(1, Math.max(0.3, available / PAGE_WIDTH_PX)));
    }

    update();
    const observer = new ResizeObserver(update);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  return { stageRef, scale };
}

function Sheet({ scale, children }: { scale: number; children: ReactNode }) {
  return (
    <div
      className="bk-sheet"
      style={{ width: PAGE_WIDTH_PX * scale, height: PAGE_HEIGHT_PX * scale }}
    >
      <div
        className="bk-sheet__inner"
        style={{ width: PAGE_WIDTH_PX, height: PAGE_HEIGHT_PX, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Caderneta de vacinação como documento: capa, identificação, histórico
 * (paginado pela altura real dos registros) e folha de rosto. Cada folha tem
 * tamanho A4 fixo; o que não cabe vai para a folha seguinte, sem rolagem interna.
 * O mesmo conteúdo é usado na tela e na impressão.
 */
export default function VaccinationBookletView({
  citizen,
  records,
  autoPrint = false,
  onClose,
}: Props) {
  const issuedAt = useMemo(() => new Date(), []);
  const items = useMemo(() => buildHistoryItems(records), [records]);
  const { pages, measurer } = useHistoryPages(items);
  const { stageRef, scale } = useSheetScale();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Impressão pedida pelo usuário: espera as folhas serem montadas e abre a janela de impressão.
  const ready = pages !== null;
  useEffect(() => {
    if (!autoPrint || !ready) return;
    const frame = requestAnimationFrame(() => window.print());
    return () => cancelAnimationFrame(frame);
  }, [autoPrint, ready]);

  const historyPages = pages ?? [];
  // Capa (1) + identificação (2) + histórico + folha de rosto (última).
  const totalPages = 3 + historyPages.length;
  const footerLabel = `${citizen.name} · CPF ${citizen.cpf}`;
  const common = { footerLabel, totalPages };

  return createPortal(
    <div className="bk-overlay" role="dialog" aria-modal="true" aria-label="Caderneta de vacinação">
      <div className="bk-toolbar">
        <div>
          <h1 className="bk-toolbar__title">Caderneta de Vacinação — {citizen.name}</h1>
        </div>

        <div className="bk-toolbar__actions">
          <button type="button" className="bk-button" onClick={() => window.print()}>
            Imprimir
          </button>
          <button type="button" className="bk-button" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>

      <div className="bk-stage" ref={stageRef}>
        {pages === null ? (
          <p className="bk-loading">Preparando a caderneta...</p>
        ) : (
          <div className="bk-pages">
            <Sheet scale={scale}>
              <CoverPage />
            </Sheet>

            <Sheet scale={scale}>
              <IdentificationPage
                citizen={citizen}
                issuedAt={issuedAt}
                notTakenCount={records.filter((record) => record.status !== 'aplicada').length}
                pageNumber={2}
                {...common}
              />
            </Sheet>

            {historyPages.map((pageItems, index) => (
              <Sheet key={index} scale={scale}>
                <HistoryPage
                  items={pageItems}
                  firstIndex={historyPages.slice(0, index).reduce((sum, page) => sum + page.length, 0)}
                  totalItems={items.length}
                  continuation={index > 0}
                  pageNumber={3 + index}
                  {...common}
                />
              </Sheet>
            ))}

            <Sheet scale={scale}>
              <ColophonPage pageNumber={totalPages} {...common} />
            </Sheet>
          </div>
        )}
      </div>

      {measurer}
    </div>,
    document.body,
  );
}

