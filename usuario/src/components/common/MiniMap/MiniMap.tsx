import simulacaoMapa from '../../../assets/simulacao_mapa.avif';

// Preview pequeno e estático do mapa, usado apenas como indicação
// visual de localização dentro do cartão de unidade. É somente uma
// imagem — não usa nenhuma API de mapas, não é clicável e não abre
// nenhum mapa interativo.
function MiniMap() {
  return (
    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-200 sm:h-24 sm:w-24">
      <img
        src={simulacaoMapa}
        alt="Simulação de mapa da localização da unidade"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

export default MiniMap;
