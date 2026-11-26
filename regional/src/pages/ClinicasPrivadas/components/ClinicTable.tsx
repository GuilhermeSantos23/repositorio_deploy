import { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined } from '@ant-design/icons';
import ClinicStatusBadge from './ClinicStatusBadge';
import type { Clinic } from '../../../types/clinic';

const PAGE_SIZE = 8;

interface ClinicTableProps {
  clinics: Clinic[];
  loading?: boolean;
  onSelectClinic: (clinic: Clinic) => void;
  onEditClinic: (clinic: Clinic) => void;
}

function ClinicTable({
  clinics,
  loading,
  onSelectClinic,
  onEditClinic,
}: ClinicTableProps) {
  // Página atual controlada aqui (e não deixada implícita pelo antd)
  // para garantir que a paginação realmente recorte `clinics` e para
  // podermos resetar para a página 1 sempre que o conjunto de dados
  // mudar (ex.: nova pesquisa) — ver useEffect abaixo.
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [clinics]);

  const columns: ColumnsType<Clinic> = [
    {
      title: 'Clínica',
      dataIndex: 'name',
      key: 'name',
      render: (_, clinic) => (
        <span className="font-medium text-gray-900">{clinic.name}</span>
      ),
    },
    {
      title: 'CNPJ',
      dataIndex: 'cnpj',
      key: 'cnpj',
    },
    {
      title: 'Nº de administradores',
      key: 'administratorsCount',
      align: 'center',
      render: (_, clinic) => clinic.administrators.length,
    },
    {
      title: 'Estado',
      key: 'status',
      render: (_, clinic) => <ClinicStatusBadge status={clinic.status} />,
    },
    {
      title: 'Ação',
      key: 'action',
      render: (_, clinic) => {
        const lastAction = clinic.history[clinic.history.length - 1];
        return (
          <span className="text-sm text-gray-600">
            {lastAction ? lastAction.action : '—'}
          </span>
        );
      },
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
              // Evita abrir o modal de detalhes ao clicar no ícone.
              e.stopPropagation();
              onEditClinic(clinic);
            }}
            className="text-gray-500 hover:text-emerald-700"
          >
            <EditOutlined />
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
        onClick: () => onSelectClinic(clinic),
        className: 'cursor-pointer',
      })}
      locale={{ emptyText: 'Nenhuma clínica encontrada.' }}
    />
  );
}

export default ClinicTable;
