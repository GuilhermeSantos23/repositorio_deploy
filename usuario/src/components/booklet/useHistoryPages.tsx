import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactElement } from 'react';
import { paginateByHeight, type HistoryItem } from '../../utils/bookletPagination';
import HistoryPage from './HistoryPage';

// Folga para diferenças de arredondamento entre a tela e a impressão.
const SAFETY_MARGIN_PX = 10;

/**
 * Descobre quantos registros cabem em cada folha do histórico.
 *
 * O hook desenha todos os registros em uma folha invisível (mesmo CSS da folha
 * real), mede a altura de cada um e a altura livre da folha, e então distribui
 * os registros por página. Não existe número fixo de vacinas por página: um
 * registro com informações adicionais ocupa mais espaço e a paginação considera isso.
 */
export function useHistoryPages(items: HistoryItem[]): {
  pages: HistoryItem[][] | null;
  measurer: ReactElement;
} {
  const measureRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<HistoryItem[][] | null>(null);

  const measure = useCallback(() => {
    const root = measureRef.current;
    const body = root?.querySelector('.bk-page__body');
    const list = root?.querySelector('.bk-records');
    if (!root || !body || !list) return;

    const capacity =
      body.getBoundingClientRect().bottom - list.getBoundingClientRect().top - SAFETY_MARGIN_PX;
    const heights = Array.from(list.querySelectorAll('[data-item]')).map(
      (element) => element.getBoundingClientRect().height,
    );

    const groups = items.length > 0 ? paginateByHeight(heights, capacity) : [[]];
    const nextPages = groups.map((group) => group.map((index) => items[index]));

    setPages((current) => {
      const same =
        current !== null &&
        current.length === nextPages.length &&
        current.every(
          (page, i) =>
            page.length === nextPages[i].length &&
            page.every((item, j) => item === nextPages[i][j]),
        );
      return same ? current : nextPages;
    });
  }, [items]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  // Se a fonte carregar depois da primeira medição, mede de novo.
  useEffect(() => {
    let active = true;
    document.fonts?.ready.then(() => {
      if (active) measure();
    });
    return () => {
      active = false;
    };
  }, [measure]);

  const measurer = (
    <div ref={measureRef} className="bk-measure" aria-hidden="true">
      <HistoryPage
        items={items}
        firstIndex={0}
        totalItems={items.length}
        continuation={false}
        footerLabel=""
        pageNumber={1}
        totalPages={1}
      />
    </div>
  );

  return { pages, measurer };
}
