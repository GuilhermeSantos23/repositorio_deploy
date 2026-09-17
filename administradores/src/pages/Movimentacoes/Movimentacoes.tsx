import { useEffect, useMemo, useState } from 'react';
import { Tabs } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import MovimentacaoTable from './components/MovimentacaoTable';
import AplicacaoTable from './components/AplicacaoTable';
import {
  getProfissionalFilterOptions,
  listAplicacoes,
  listMovimentacoes,
} from '../../services/movimentacaoService';
import {
  MODO_MOVIMENTACAO_OPTIONS,
  TIPO_MOVIMENTACAO_FILTER_OPTIONS,
} from '../../utils/movimentacaoOptions';
import type {
  AplicacaoDetalhada,
  ModoMovimentacao,
  MovimentacaoDetalhada,
  TipoMovimentacao,
} from '../../types/movimentacao';

function Movimentacoes() {
  const [modo, setModo] = useState<ModoMovimentacao>('tipo');

  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoDetalhada[]>([]);
  const [aplicacoes, setAplicacoes] = useState<AplicacaoDetalhada[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState<TipoMovimentacao | 'todos'>('todos');
  const [profissionalFilter, setProfissionalFilter] = useState('todos');

  // Mesmo padrão de Estoque/Profissionais: carrega uma vez ao montar a
  // tela. Os dois relatórios (Tipo e Ação) são pequenos, então os dois são
  // carregados juntos — trocar de modo só troca qual já foi carregado é
  // exibido, sem precisar de uma nova requisição.
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [movimentacoesResult, aplicacoesResult] = await Promise.all([
        listMovimentacoes(),
        listAplicacoes(),
      ]);
      setMovimentacoes(movimentacoesResult);
      setAplicacoes(aplicacoesResult);
      setIsLoading(false);
    }
    loadData();
  }, []);

  // Trocar de modo limpa os filtros/busca do modo anterior — cada modo tem
  // seus próprios critérios e eles não fazem sentido misturados.
  function handleModoChange(novoModo: string) {
    setModo(novoModo as ModoMovimentacao);
    setSearchTerm('');
    setTipoFilter('todos');
    setProfissionalFilter('todos');
  }

  const movimentacoesFiltradas = useMemo(() => {
    const termo = searchTerm.trim().toLowerCase();

    return movimentacoes.filter((mov) => {
      const combinaTipo = tipoFilter === 'todos' || mov.tipo === tipoFilter;
      const combinaBusca =
        !termo ||
        mov.lote.vaccineName.toLowerCase().includes(termo) ||
        mov.lote.code.toLowerCase().includes(termo);

      return combinaTipo && combinaBusca;
    });
  }, [movimentacoes, searchTerm, tipoFilter]);

  const aplicacoesFiltradas = useMemo(() => {
    const termo = searchTerm.trim().toLowerCase();

    return aplicacoes.filter((aplicacao) => {
      const combinaProfissional =
        profissionalFilter === 'todos' || aplicacao.profissionalId === profissionalFilter;
      const combinaBusca =
        !termo ||
        aplicacao.profissionalNome.toLowerCase().includes(termo) ||
        aplicacao.lote.vaccineName.toLowerCase().includes(termo) ||
        aplicacao.lote.code.toLowerCase().includes(termo);

      return combinaProfissional && combinaBusca;
    });
  }, [aplicacoes, searchTerm, profissionalFilter]);

  const profissionalOptions = useMemo(() => getProfissionalFilterOptions(aplicacoes), [aplicacoes]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Movimentações</h1>
        <p className="mt-1 text-sm text-gray-500">
          Relatório de como os lotes estão se movimentando e de quem está aplicando as vacinas.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <Tabs
          activeKey={modo}
          onChange={handleModoChange}
          items={MODO_MOVIMENTACAO_OPTIONS.map((option) => ({
            key: option.value,
            label: option.label,
          }))}
        />

        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
          <div className="relative flex-1">
            <SearchOutlined className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                modo === 'tipo'
                  ? 'Buscar por vacina ou lote...'
                  : 'Buscar por profissional, vacina ou lote...'
              }
              className="w-full rounded-lg border border-gray-300 py-2 pr-3 pl-9 text-sm text-gray-700 outline-none focus:border-emerald-500"
            />
          </div>

          {modo === 'tipo' && (
            <div className="flex items-center gap-2">
              <FilterOutlined className="text-gray-400" />
              <label htmlFor="tipo-filter" className="text-sm whitespace-nowrap text-gray-600">
                Tipo:
              </label>
              <select
                id="tipo-filter"
                value={tipoFilter}
                onChange={(e) => setTipoFilter(e.target.value as TipoMovimentacao | 'todos')}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-emerald-500 sm:w-auto"
              >
                <option value="todos">Todos</option>
                {TIPO_MOVIMENTACAO_FILTER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {modo === 'acao' && (
            <div className="flex items-center gap-2">
              <FilterOutlined className="text-gray-400" />
              <label htmlFor="profissional-filter" className="text-sm whitespace-nowrap text-gray-600">
                Profissional:
              </label>
              <select
                id="profissional-filter"
                value={profissionalFilter}
                onChange={(e) => setProfissionalFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-emerald-500 sm:w-auto"
              >
                <option value="todos">Todos</option>
                {profissionalOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {modo === 'tipo' ? (
          <MovimentacaoTable movimentacoes={movimentacoesFiltradas} loading={isLoading} />
        ) : (
          <AplicacaoTable aplicacoes={aplicacoesFiltradas} loading={isLoading} />
        )}
      </div>
    </div>
  );
}

export default Movimentacoes;