import { useEffect, useState } from 'react';

// Diz se a tela é larga o suficiente para mostrar duas páginas lado a
// lado (como um livro aberto). Usado pela Caderneta de Saúde: em telas
// largas mostramos duas páginas por vez, em telas estreitas (celular)
// mostramos uma página por vez.
const DESKTOP_QUERY = '(min-width: 768px)';

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia(DESKTOP_QUERY).matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_QUERY);
    const handleChange = () => setIsDesktop(mediaQuery.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isDesktop;
}
