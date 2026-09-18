import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout/MainLayout';
import Login from '../pages/Login/Login';
import EsqueciSenha from '../pages/EsqueciSenha/EsqueciSenha';
import Home from '../pages/home/Home';
import Settings from '../pages/Settings/Settings';
import Caderneta from '../pages/Caderneta/Caderneta';
import Aplicacoes from '../pages/Aplicacoes/Aplicacoes';
import Historico from '../pages/Historico/Historico';
import { isAuthenticated } from '../services/authService';

// Rota de layout: tudo que for uma página "logada" é renderizada dentro
// do MainLayout, através do <Outlet />. Como o MainLayout só é montado
// uma vez para todo esse grupo de rotas, o UserProvider (que fica dentro
// dele) mantém o estado ao navegar entre as páginas.
function AreaLogada() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

// Garante que as páginas internas só sejam renderizadas com uma sessão
// ativa. Como a checagem acontece a cada renderização da rota, isso
// também impede o acesso pelo botão "voltar" do navegador depois de um
// logout: mesmo que o navegador tente voltar para /home, a rota é
// renderizada de novo, vê que não há sessão e redireciona para /login.
function ProtectedRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <AreaLogada />;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/cadernetas" element={<Caderneta />} />
          <Route path="/aplicacoes" element={<Aplicacoes />} />
          <Route path="/historico" element={<Historico />} />
          <Route path="/configuracoes" element={<Settings />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
