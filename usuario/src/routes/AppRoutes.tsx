import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import MainLayout from '../layouts/MainLayout/MainLayout';
import Login from '../pages/Login/Login';
import Cadastro from '../pages/Cadastro/Cadastro';
import RecuperarAcesso from '../pages/RecuperarAcesso/RecuperarAcesso';
import DocumentoLegal from '../pages/Legal/DocumentoLegal';
import Home from '../pages/Home/Home';
import UnidadesProximas from '../pages/UnidadesProximas/UnidadesProximas';
import Settings from '../pages/Settings/Settings';
import Calendario from '../pages/Calendario/Calendario';
import CadernetaVacinacao from '../pages/CadernetaVacinacao/CadernetaVacinacao';
import HistoricoVacinal from '../pages/HistoricoVacinal/HistoricoVacinal';
import InformacoesVacinais from '../pages/Informacoes/InformacoesVacinais';
import UserProvider from '../contexts/UserProvider';
import AlertProvider from '../contexts/AlertProvider';
import { useUser } from '../hooks/useUser';

// Rota de layout: tudo que for uma página "logada" é renderizado dentro
// do MainLayout, através do <Outlet />.
function AreaLogada() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

// Protege as rotas internas: se ninguém estiver logado, manda para o
// Login em vez de mostrar a página. Fica dentro do UserProvider/
// AlertProvider (ver AppRoutes) para poder usar o useUser().
function RotaProtegida() {
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <AreaLogada />;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      {/* UserProvider e AlertProvider ficam aqui, envolvendo todas as
          rotas (login, cadastro e área logada), porque o Login e o
          Cadastro também precisam ler/gravar os dados do usuário. */}
      <UserProvider>
        <AlertProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/recuperar-acesso" element={<RecuperarAcesso />} />
            <Route
              path="/termos-de-uso"
              element={<DocumentoLegal tipo="termos" />}
            />
            <Route
              path="/politica-de-privacidade"
              element={<DocumentoLegal tipo="privacidade" />}
            />

            <Route element={<RotaProtegida />}>
              <Route path="/home" element={<Home />} />
              <Route
                path="/unidades-proximas"
                element={<UnidadesProximas />}
              />
              <Route path="/configuracoes" element={<Settings />} />
              <Route path="/calendario" element={<Calendario />} />
              <Route
                path="/caderneta-vacinacao"
                element={<CadernetaVacinacao />}
              />
              <Route
                path="/historico-vacinal"
                element={<HistoricoVacinal />}
              />
              <Route
                path="/informacoes-vacinais"
                element={<InformacoesVacinais />}
              />
            </Route>

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AlertProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;
