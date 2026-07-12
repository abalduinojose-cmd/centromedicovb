/**
 * Logotipo oficial Centro Médico Viver Bem (PNG transparente em /img/logo.png).
 * `variante`: 'claro' envolve a logo em um card branco para fundos escuros.
 */
export default function Logo({ variante = 'escuro', tamanho = 'md' }) {
  const altura = tamanho === 'lg' ? 'h-20 md:h-24' : 'h-16 md:h-20';

  if (variante === 'claro') {
    return (
      <span className="inline-block rounded-2xl bg-white px-4 py-2.5 shadow-soft">
        <img
          src="img/logo.png"
          alt="Centro Médico Viver Bem"
          className={`${altura} w-auto`}
          loading="eager"
        />
      </span>
    );
  }

  return (
    <img
      src="img/logo.png"
      alt="Centro Médico Viver Bem"
      className={`${altura} w-auto`}
      loading="eager"
    />
  );
}
