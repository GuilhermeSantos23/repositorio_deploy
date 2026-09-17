import { useNavigate } from 'react-router-dom';
import { ExclamationCircleFilled, CloseOutlined } from '@ant-design/icons';
import { useAlert } from '../../../hooks/useAlert';

// Card flutuante que aparece no canto da tela quando um alerta de
// surto/campanha chega. Fica disponível em qualquer Page logada porque
// é renderizado dentro do MainLayout.
function AlertPopup() {
  const { alert, isAlertVisible, closeAlert, markAlertAsRead } = useAlert();
  const navigate = useNavigate();

  if (!alert || !isAlertVisible) {
    return null;
  }

  function handleGoToHome() {
    markAlertAsRead();
    navigate('/home');
  }

  return (
    <div className="fixed right-4 bottom-20 z-50 w-80 max-w-[calc(100vw-2rem)] rounded-lg border border-orange-300 bg-white p-4 shadow-lg lg:right-6 lg:bottom-6">
      <button
        type="button"
        onClick={closeAlert}
        aria-label="Fechar alerta"
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        <CloseOutlined className="text-xs" />
      </button>

      <button
        type="button"
        onClick={handleGoToHome}
        className="block w-full text-left"
      >
        <div className="flex items-center gap-2 pr-4">
          <ExclamationCircleFilled className="text-lg text-orange-500" />
          <span className="text-sm font-bold text-gray-900">ALERTA</span>
        </div>

        <p className="mt-2 text-sm text-gray-700">{alert.type}</p>
        <p className="mt-0.5 text-base font-bold text-orange-600">
          {alert.title}
        </p>
      </button>
    </div>
  );
}

export default AlertPopup;
