import { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined, PaperClipOutlined } from '@ant-design/icons';
import StockStatusBadge from './StockStatusBadge';
import { formatDateBR } from '../../../utils/date';
import { isExpired, isNearExpiration } from '../../../utils/stockRules';
import type { VaccineLot } from '../../../types/lot';

const PAGE_SIZE = 8;

interface LotTableProps {
  lots: VaccineLot[];
  loading?: boolean;
  onEditLot: (lot: VaccineLot) => void;
  onDeleteLot: (lot: VaccineLot) => void;
}

function LotTable({ lots, loading, onEditLot, onDeleteLot }: LotTableProps) {
  // Mesmo padrão de UBSTable: página controlada aqui, resetando para a
  // página 1 sempre que a lista mudar (nova busca/filtro).
  const [page, setPage] = useState(1);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reseta a paginação sempre que a lista muda (ex.: nova pesquisa)
    setPage(1);
  }, [lots]);

  const columns: ColumnsType<VaccineLot> = [
    {
      title: 'Vacina',
      dataIndex: 'vaccineName',
      key: 'vaccineName',
      render: (_, lot) => <span className="font-medium text-gray-900">{lot.vaccineName}</span>,
    },
    {
      title: 'Lote',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Fabricante',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
    },
    {
      title: 'Recebimento',
      key: 'receivedAt',
      render: (_, lot) => formatDateBR(lot.receivedAt),
    },
    {
      title: 'Validade',
      key: 'expiresAt',
      render: (_, lot) => (
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
          {formatDateBR(lot.expiresAt)}
          {isExpired(lot.expiresAt) && (
            <span className="text-xs font-medium text-red-600">(vencido)</span>
          )}
          {!isExpired(lot.expiresAt) && isNearExpiration(lot.expiresAt) && (
            <span className="text-xs font-medium text-amber-600">(vence em breve)</span>
          )}
        </span>
      ),
    },
    {
      title: 'Quantidade',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, lot) => <StockStatusBadge quantity={lot.quantity} />,
    },
    {
      title: 'Anexo',
      key: 'attachment',
      render: (_, lot) =>
        lot.attachmentName ? (
          <span
            className="inline-flex items-center gap-1 text-xs text-gray-500"
            title={lot.attachmentName}
          >
            <PaperClipOutlined /> Romaneio
          </span>
        ) : (
          <span className="text-xs text-gray-300">—</span>
        ),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, lot) => (
        <div className="flex gap-3">
          <button
            type="button"
            title="Editar lote"
            aria-label="Editar lote"
            onClick={(e) => {
              e.stopPropagation();
              onEditLot(lot);
            }}
            className="text-gray-500 hover:text-emerald-700"
          >
            <EditOutlined />
          </button>
          <button
            type="button"
            title="Excluir lote"
            aria-label="Excluir lote"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteLot(lot);
            }}
            className="text-gray-500 hover:text-red-600"
          >
            <DeleteOutlined />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={lots}
      loading={loading}
      pagination={{
        current: page,
        pageSize: PAGE_SIZE,
        onChange: (nextPage: number) => setPage(nextPage),
      }}
      scroll={{ x: true }}
      locale={{ emptyText: 'Nenhum lote encontrado.' }}
    />
  );
}

export default LotTable;