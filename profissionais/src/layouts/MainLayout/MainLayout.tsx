import type { ReactNode } from 'react';
import Header from '../../components/layout/Header/Header';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import BottomNavigation from '../../components/layout/BottomNavigation/BottomNavigation';
import UserProvider from '../../contexts/UserProvider';

interface MainLayoutProps {
  children: ReactNode;
}

// UserProvider fica aqui porque o MainLayout é montado uma única vez para
// toda a área logada (as rotas internas só trocam o conteúdo do <main>),
// então o nome/avatar do usuário continuam os mesmos ao navegar entre as
// Pages.
//
// O layout usa altura fixa de tela (h-screen + overflow-hidden) e só o
// <main> rola internamente (overflow-y-auto). Assim o <body> sempre tem
// exatamente o tamanho da viewport, e o controle de Brilho em Preferências
// pode aplicar o filtro no <body> inteiro (como exigido) sem quebrar o
// position:fixed da BottomNavigation.
function MainLayout({ children }: MainLayoutProps) {
  return (
    <UserProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar />

        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />

          <main className="flex-1 overflow-y-auto px-4 py-6 pb-24 lg:px-10 lg:py-8 lg:pb-8">
            {children}
          </main>

          <BottomNavigation />
        </div>
      </div>
    </UserProvider>
  );
}

export default MainLayout;
