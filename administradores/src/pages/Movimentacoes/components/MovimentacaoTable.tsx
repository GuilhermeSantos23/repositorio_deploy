import { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { formatDateBR } from '../../../utils/date';
import { isExpired, isNearExpiration } from '../../../utils/stockRules';
import {
  TIPO_MOVIMENTACAO_LABELS,
  TIPO_MOVIMENTACAO_TEXT_CLASSES,
} from '../../../utils/movimentacaoOptions';
import type { MovimentacaoDetalhada } from '../../../types/movimentacao';

const PAGE_SIZE = 8;

interface MovimentacaoTableProps {
  movimentacoes: MovimentacaoDetalhada[];
  loading?: boolean;
}

// Tabela do modo Tipo: mostra como os lotes estão se movimentando
// (entrada/alteração/exclusão). É um relatório só de leitura — sem coluna
// de ações, mesmo padrão de LotTable/ProfissionalTable pra paginação.
function MovimentacaoTable({ movimentacoes, loading }: MovimentacaoTableProps) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reseta a paginação sempre que a lista muda (ex.: novo filtro)
    setPage(1);
  }, [movimentacoes]);

  const columns: ColumnsType<MovimentacaoDetalhada> = [
    {
      title: 'Tipo',
      key: 'tipo',
      render: (_, mov) => (
        <span className={`text-sm font-medium whitespace-nowrap ${TIPO_MOVIMENTACAO_TEXT_CLASSES[mov.tipo]}`}>
          {TIPO_MOVIMENTACAO_LABELS[mov.tipo]}
        </span>
      ),
    },
    {
      title: 'Lote',
      key: 'lote',
      render: (_, mov) => (
        <div>
          <p className="font-medium text-gray-900">{mov.lote.code}</p>
          <p className="text-xs text-gray-500">{mov.lote.vaccineName}</p>
        </div>
      ),
    },
    {
      title: 'Fabricante',
      dataIndex: ['lote', 'manufacturer'],
      key: 'fabricante',
    },
    {
      title: 'Quantidade',
      dataIndex: 'quantidade',
      key: 'quantidade',
    },
    {
      title: 'Vencimento',
      key: 'vencimento',
      // Mesma exibição usada em LotTable, para manter a leitura de validade
      // consistente entre Estoque e Movimentações.
      render: (_, mov) => (
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
          {formatDateBR(mov.lote.expiresAt)}
          {isExpired(mov.lote.expiresAt) && (
            <span className="text-xs font-medium text-red-600">(vencido)</span>
          )}
          {!isExpired(mov.lote.expiresAt) && isNearExpiration(mov.lote.expiresAt) && (
            <span className="text-xs font-medium text-amber-600">(vence em breve)</span>
          )}
        </span>
      ),
    },
    {
      title: 'Data',
      key: 'data',
      render: (_, mov) => formatDateBR(mov.data),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={movimentacoes}
      loading={loading}
      pagination={{
        current: page,
        pageSize: PAGE_SIZE,
        onChange: (nextPage: number) => setPage(nextPage),
      }}
      scroll={{ x: true }}
      locale={{ emptyText: 'Nenhuma movimentação encontrada.' }}
    />
  );
}

export default MovimentacaoTable;
