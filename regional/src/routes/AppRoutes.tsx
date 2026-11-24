import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';

import MainLayout from '../layouts/MainLayout/MainLayout';

import Login from '../pages/Login/Login';
import EsqueciSenha from '../pages/EsqueciSenha/EsqueciSenha';
import Dashboard from '../pages/Dashboard/Dashboard';
import ClinicasPrivadas from '../pages/ClinicasPrivadas/ClinicasPrivadas';
import UBSs from '../pages/UBSs/UBSs';
import Settings from '../pages/Settings/Settings';
import RelatorioRegional from '../pages/RelatorioRegional/RelatorioRegional';

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

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Esqueci minha senha */}
        <Route
          path="/esqueci-senha"
          element={<EsqueciSenha />}
        />

        {/* Área logada */}
        <Route element={<AreaLogada />}>

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* UBSs */}
          <Route
            path="/ubs"
            element={<UBSs />}
          />

          {/* Clínicas privadas */}
          <Route
            path="/clinicas-privadas"
            element={<ClinicasPrivadas />}
          />

          {/* Relatório Regional */}
          <Route
            path="/relatorio-regional"
            element={<RelatorioRegional />}
          />

          {/* Configurações */}
          <Route
            path="/configuracoes"
            element={<Settings />}
          />

        </Route>

        {/* Página inicial */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Página não encontrada */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;