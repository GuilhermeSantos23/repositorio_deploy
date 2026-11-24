export default function CoverPage() {
  return (
    <section className="bk-page bk-cover" lang="pt-BR">
      <div className="bk-cover__top">
        <span className="bk-cover__brand">Vac+</span>
      </div>

      <div className="bk-cover__middle">
        <h1>Caderneta de Vacinação</h1>
        <div className="bk-cover__rule" />
        <p>Registro das vacinas aplicadas ao cidadão</p>
      </div>

      <div className="bk-cover__bottom">
        Documento digital do sistema Vac+, desenvolvido com finalidade acadêmica e demonstrativa.
        Não é um documento oficial emitido por órgão público de saúde.
      </div>
    </section>
  );
}
