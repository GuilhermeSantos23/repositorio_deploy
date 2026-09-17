import { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import UBSStatusBadge from './UBSStatusBadge';
import type { UBS } from '../../../types/ubs';

const PAGE_SIZE = 8;

interface UBSTableProps {
  ubsList: UBS[];
  loading?: boolean;
  onEditUBS: (ubs: UBS) => void;
  onDeleteUBS: (ubs: UBS) => void;
}

function UBSTable({ ubsList, loading, onEditUBS, onDeleteUBS }: UBSTableProps) {
  // Página atual controlada aqui (mesmo padrão de ClinicTable) para
  // garantir que a paginação recorte `ubsList` e resetar para a
  // página 1 sempre que o conjunto de dados mudar (ex.: nova pesquisa).
  const [page, setPage] = useState(1);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reseta a paginação sempre que a lista muda (ex.: nova pesquisa)
    setPage(1);
  }, [ubsList]);

  const columns: ColumnsType<UBS> = [
    {
      title: 'UBS',
      dataIndex: 'name',
      key: 'name',
      render: (_, ubs) => <span className="font-medium text-gray-900">{ubs.name}</span>,
    },
    {
      title: 'Código',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Região',
      dataIndex: 'region',
      key: 'region',
    },
    {
      title: 'Administrador',
      key: 'administrator',
      render: (_, ubs) => {
        const [first, ...rest] = ubs.administrators;
        if (!first) return '—';
        return rest.length > 0 ? `${first.name} +${rest.length}` : first.name;
      },
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, ubs) => <UBSStatusBadge status={ubs.status} />,
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, ubs) => (
        <div className="flex gap-3">
          <button
            type="button"
            title="Editar UBS"
            aria-label="Editar UBS"
            onClick={(e) => {
              e.stopPropagation();
              onEditUBS(ubs);
            }}
            className="text-gray-500 hover:text-emerald-700"
          >
            <EditOutlined />
          </button>
          <button
            type="button"
            title="Excluir UBS"
            aria-label="Excluir UBS"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteUBS(ubs);
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
      dataSource={ubsList}
      loading={loading}
      pagination={{
        current: page,
        pageSize: PAGE_SIZE,
        onChange: (nextPage: number) => setPage(nextPage),
      }}
      scroll={{ x: true }}
      onRow={(ubs: UBS) => ({
        onClick: () => onEditUBS(ubs),
        className: 'cursor-pointer',
      })}
      locale={{ emptyText: 'Nenhuma UBS encontrada.' }}
    />
  );
}

export default UBSTable;
