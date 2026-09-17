import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout/MainLayout';
import Login from '../pages/Login/Login';
import EsqueciSenha from '../pages/EsqueciSenha/EsqueciSenha';
import Home from '../pages/home/Home';
import Settings from '../pages/Settings/Settings';
import Caderneta from '../pages/Caderneta/Caderneta';
import Aplicacoes from '../pages/Aplicacoes/Aplicacoes';
import Historico from '../pages/Historico/Historico';

// Rota de layout: tudo que for uma página "logada" é renderizado dentro
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

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />

        <Route element={<AreaLogada />}>
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
