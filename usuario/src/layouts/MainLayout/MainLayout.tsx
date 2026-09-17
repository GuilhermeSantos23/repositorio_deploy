import { useState, type ReactNode } from 'react';
import Header from '../../components/layout/Header/Header';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import BottomNavigation from '../../components/layout/BottomNavigation/BottomNavigation';
import HamburgerMenu from '../../components/layout/HamburguerMenu/HamburguerMenu';
import AlertPopup from '../../components/common/AlertPopup/AlertPopup';

interface MainLayoutProps {
  children: ReactNode;
}

// UserProvider e AlertProvider agora ficam em AppRoutes, envolvendo todas
// as rotas (login, cadastro e área logada), porque o Login e o Cadastro
// também precisam ler/gravar os dados do usuário autenticado.
function MainLayout({ children }: MainLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex min-h-dvh bg-gray-50">
      <Sidebar />

      <div className="flex min-h-dvh flex-1 flex-col overflow-x-hidden">
        <Header onMenuClick={() => setIsMenuOpen(true)} />

        <main
          id="app-content"
          className="flex-1 px-4 py-6 pb-24 lg:px-8 lg:pb-6"
        >
          {children}
        </main>

        <BottomNavigation />
      </div>

      <HamburgerMenu open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <AlertPopup />
    </div>
  );
}

export default MainLayout;
