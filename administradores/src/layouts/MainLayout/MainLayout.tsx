import { useState, type ReactNode } from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Header from '../../components/layout/Header/Header';
import BottomNavigation from '../../components/layout/BottomNavigation/BottomNavigation';
import HamburguerMenu from '../../components/layout/HamburguerMenu/HamburguerMenu';

interface MainLayoutProps {
  children: ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex min-h-screen flex-1 flex-col">
        <Header onMenuClick={() => setIsMenuOpen(true)} />

        <main
          id="content"
          className="flex-1 px-4 py-6 pb-24 lg:px-8 lg:pb-6"
        >
          {children}
        </main>

        <BottomNavigation />
      </div>

      <HamburguerMenu
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </div>
  );
}

export default MainLayout;
