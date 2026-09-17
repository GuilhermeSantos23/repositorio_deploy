import { useEffect, useState, type ReactNode } from 'react';
import { AlertContext, type AlertData } from './alertContext';

interface AlertProviderProps {
  children: ReactNode;
}

const EXAMPLE_ALERT_CONTENT = {
  type: 'Surto epidemiológico',
  title: 'Dengue',
  description:
    'Identificamos um aumento fora do padrão nos casos de dengue na sua região. Manter a vacinação em dia ajuda a prevenir complicações graves e protege também as pessoas ao seu redor.',
};

const ALERT_DELAY_MS = 20000;

function AlertProvider({ children }: AlertProviderProps) {
  const [alert, setAlert] = useState<AlertData | null>(null);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [hasUnreadNotification, setHasUnreadNotification] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlert({ ...EXAMPLE_ALERT_CONTENT, issuedAt: new Date() });
      setIsAlertVisible(true);
      setHasUnreadNotification(true);
    }, ALERT_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  function closeAlert() {
    setIsAlertVisible(false);
  }

  function markAlertAsRead() {
    setIsAlertVisible(false);
    setHasUnreadNotification(false);
  }

  return (
    <AlertContext.Provider
      value={{
        alert,
        isAlertVisible,
        hasUnreadNotification,
        closeAlert,
        markAlertAsRead,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
}

export default AlertProvider;
