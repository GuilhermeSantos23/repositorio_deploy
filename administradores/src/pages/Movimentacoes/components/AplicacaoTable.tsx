import { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { formatDateBR } from '../../../utils/date';
import type { AplicacaoDetalhada } from '../../../types/movimentacao';

const PAGE_SIZE = 8;

interface AplicacaoTableProps {
  aplicacoes: AplicacaoDetalhada[];
  loading?: boolean;
}

// Tabela do modo Ação: mostra quem aplicou qual vacina. Também é um
// relatório só de leitura, mesmo padrão de MovimentacaoTable.
function AplicacaoTable({ aplicacoes, loading }: AplicacaoTableProps) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reseta a paginação sempre que a lista muda (ex.: novo filtro)
    setPage(1);
  }, [aplicacoes]);

  const columns: ColumnsType<AplicacaoDetalhada> = [
    {
      title: 'Profissional',
      dataIndex: 'profissionalNome',
      key: 'profissional',
    },
    {
      title: 'Lote',
      key: 'lote',
      render: (_, aplicacao) => (
        <div>
          <p className="font-medium text-gray-900">{aplicacao.lote.code}</p>
          <p className="text-xs text-gray-500">{aplicacao.lote.vaccineName}</p>
        </div>
      ),
    },
    {
      title: 'Data',
      key: 'data',
      render: (_, aplicacao) => formatDateBR(aplicacao.data),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={aplicacoes}
      loading={loading}
      pagination={{
        current: page,
        pageSize: PAGE_SIZE,
        onChange: (nextPage: number) => setPage(nextPage),
      }}
      scroll={{ x: true }}
      locale={{ emptyText: 'Nenhuma aplicação encontrada.' }}
    />
  );
}

export default AplicacaoTable;
