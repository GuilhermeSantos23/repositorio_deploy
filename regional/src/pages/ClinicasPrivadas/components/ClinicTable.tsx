import { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ClinicStatusBadge from './ClinicStatusBadge';
import type { Clinic } from '../../../types/clinic';

const PAGE_SIZE = 8;

interface ClinicTableProps {
  clinics: Clinic[];
  loading?: boolean;
  onEditClinic: (clinic: Clinic) => void;
  onDeleteClinic: (clinic: Clinic) => void;
}

function ClinicTable({ clinics, loading, onEditClinic, onDeleteClinic }: ClinicTableProps) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reseta a paginação sempre que a lista muda (ex.: nova pesquisa)
    setPage(1);
  }, [clinics]);

  const columns: ColumnsType<Clinic> = [
    {
      title: 'Clínica',
      dataIndex: 'name',
      key: 'name',
      render: (_, clinic) => <span className="font-medium text-gray-900">{clinic.name}</span>,
    },
    {
      title: 'CNPJ',
      dataIndex: 'cnpj',
      key: 'cnpj',
    },
    {
      title: 'Região',
      dataIndex: 'region',
      key: 'region',
    },
    {
      title: 'Administrador',
      key: 'administrator',
      render: (_, clinic) => {
        const [first, ...rest] = clinic.administrators;
        if (!first) return '—';
        return rest.length > 0 ? `${first.name} +${rest.length}` : first.name;
      },
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, clinic) => <ClinicStatusBadge status={clinic.status} />,
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, clinic) => (
        <div className="flex gap-3">
          <button
            type="button"
            title="Editar clínica"
            aria-label="Editar clínica"
            onClick={(e) => {
              e.stopPropagation();
              onEditClinic(clinic);
            }}
            className="text-gray-500 hover:text-emerald-700"
          >
            <EditOutlined />
          </button>
          <button
            type="button"
            title="Excluir clínica"
            aria-label="Excluir clínica"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClinic(clinic);
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
      dataSource={clinics}
      loading={loading}
      pagination={{
        current: page,
        pageSize: PAGE_SIZE,
        onChange: (nextPage: number) => setPage(nextPage),
      }}
      scroll={{ x: true }}
      onRow={(clinic: Clinic) => ({
        onClick: () => onEditClinic(clinic),
        className: 'cursor-pointer',
      })}
      locale={{ emptyText: 'Nenhuma clínica encontrada.' }}
    />
  );
}

export default ClinicTable;
