import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout/MainLayout';
import Login from '../pages/Login/Login';
import EsqueciSenha from '../pages/EsqueciSenha/EsqueciSenha';
import Dashboard from '../pages/Dashboard/Dashboard';
import Profissionais from '../pages/Profissionais/Profissionais';
import Estoque from '../pages/Estoque/Estoque';
import Movimentacoes from '../pages/Movimentacoes/Movimentacoes';
import Campanhas from '../pages/Campanhas/Campanhas';
import Settings from '../pages/Settings/Settings';

// Rota de layout: toda página logada é renderizada dentro do MainLayout,
// através do <Outlet />. Como o MainLayout só é montado uma vez para todo
// esse grupo de rotas, o estado do menu hambúrguer (isMenuOpen) se mantém
// ao navegar entre as páginas administrativas.
function AreaLogada() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />

        <Route element={<AreaLogada />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profissionais" element={<Profissionais />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/movimentacoes" element={<Movimentacoes />} />
          <Route path="/campanhas" element={<Campanhas />} />
          <Route path="/configuracoes" element={<Settings />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
