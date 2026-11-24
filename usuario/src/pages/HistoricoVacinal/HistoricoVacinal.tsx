import { useMemo } from 'react';
import CartaoVacinas from '../../components/Historico/CartaoVacinas';
import { criarVacinasPrevistasMock } from '../../data/historicoVacinalMock';
import { classificarVacinas, textoAtraso } from '../../utils/prazosVacinais';
import { formatMonthYear } from '../../utils/formatDate';
import { useUser } from '../../hooks/useUser';

function HistoricoVacinal() {
  const { userName } = useUser();

  // As vacinas vêm de dados simulados (ver data/historicoVacinalMock.ts).
  const { proximas, pendentes, atrasadas } = useMemo(() => {
    const hoje = new Date();
    const grupos = classificarVacinas(criarVacinasPrevistasMock(hoje), hoje);

    return {
      // Só as 3 próximas vacinas.
      proximas: grupos.proximas.slice(0, 3).map((v) => ({
        id: v.id,
        nome: v.nome,
        info: `Prevista para ${formatMonthYear(v.dataPrevista)}`,
      })),
      pendentes: grupos.pendentes.map((v) => ({
        id: v.id,
        nome: v.nome,
        info: `Campanha até ${formatMonthYear(v.dataLimite)}`,
      })),
      // Já vêm do maior atraso para o menor.
      atrasadas: grupos.atrasadas.map((v) => ({
        id: v.id,
        nome: v.nome,
        info: textoAtraso(v.dataLimite, hoje),
      })),
    };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Olá, {userName}!</h1>
      <p className="mt-1 text-sm text-gray-500">
        Aqui estão suas próximas vacinas, as pendentes e as que estão em atraso
      </p>

      <div className="mt-6 flex flex-col gap-5">
        <CartaoVacinas
          titulo="PRÓXIMAS VACINAS"
          itens={proximas}
          textoVazio="Nenhuma vacina prevista por enquanto."
          atrasoAnimacao={0}
        />

        <CartaoVacinas
          titulo="VACINAS PENDENTES"
          itens={pendentes}
          comVerMais
          textoVazio="Você não tem vacinas pendentes."
          atrasoAnimacao={100}
        />

        <CartaoVacinas
          titulo="VACINAS EM ATRASO"
          itens={atrasadas}
          variante="atraso"
          comVerMais
          textoVazio="Você não tem vacinas em atraso."
          atrasoAnimacao={200}
        />
      </div>
    </div>
  );
}

export default HistoricoVacinal;
