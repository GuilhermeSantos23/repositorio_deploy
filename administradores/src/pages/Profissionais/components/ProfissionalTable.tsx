import { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { CARGO_LABELS } from '../../../utils/profissionalOptions';
import { getProfissionalCPF } from '../../../services/profissionalService';
import type { Profissional } from '../../../types/profissional';

const PAGE_SIZE = 8;

interface ProfissionalTableProps {
  profissionais: Profissional[];
  loading?: boolean;
  onEditProfissional: (profissional: Profissional) => void;
  onDeleteProfissional: (profissional: Profissional) => void;
}

function formatAdmissionDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
}

function ProfissionalTable({
  profissionais,
  loading,
  onEditProfissional,
  onDeleteProfissional,
}: ProfissionalTableProps) {
  // Mesmo padrão de paginação controlada localmente usado em UBSTable.
  const [page, setPage] = useState(1);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reseta a paginação sempre que a lista muda (ex.: nova pesquisa)
    setPage(1);
  }, [profissionais]);

  const columns: ColumnsType<Profissional> = [
    {
      title: 'Nome',
      key: 'nome',
      render: (_, prof) => (
        <span className="font-medium text-gray-900">
          {prof.firstName} {prof.lastName}
        </span>
      ),
    },
    {
      title: 'CPF',
      key: 'cpf',
      render: (_, prof) => getProfissionalCPF(prof.id),
    },
    {
      title: 'COREN',
      dataIndex: 'coren',
      key: 'coren',
    },
    {
      title: 'Cargo',
      key: 'cargo',
      render: (_, prof) => CARGO_LABELS[prof.cargo],
    },
    {
      title: 'Data de admissão',
      key: 'admissionDate',
      render: (_, prof) => formatAdmissionDate(prof.admissionDate),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, prof) => {
        const bloqueado = prof.status === 'bloqueado';
        return (
          <div className="flex gap-3">
            <button
              type="button"
              title={bloqueado ? 'Profissional já foi desligado' : 'Editar profissional'}
              aria-label="Editar profissional"
              disabled={bloqueado}
              onClick={(e) => {
                e.stopPropagation();
                onEditProfissional(prof);
              }}
              className="text-gray-500 hover:text-emerald-700 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:text-gray-300"
            >
              <EditOutlined />
            </button>
            <button
              type="button"
              title={bloqueado ? 'Profissional já foi desligado' : 'Excluir/demitir profissional'}
              aria-label="Excluir profissional"
              disabled={bloqueado}
              onClick={(e) => {
                e.stopPropagation();
                onDeleteProfissional(prof);
              }}
              className="text-gray-500 hover:text-red-600 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:text-gray-300"
            >
              <DeleteOutlined />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={profissionais}
      loading={loading}
      pagination={{
        current: page,
        pageSize: PAGE_SIZE,
        onChange: (nextPage: number) => setPage(nextPage),
      }}
      scroll={{ x: true }}
      locale={{ emptyText: 'Nenhum profissional encontrado.' }}
    />
  );
}

export default ProfissionalTable;
