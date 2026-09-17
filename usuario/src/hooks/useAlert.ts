import { useContext } from 'react';
import { AlertContext } from '../contexts/alertContext';

// Hook para ler o estado do alerta global (surtos/campanhas) e reagir a ele.
// Usado pelo Header (pontinho do sino), pelo AlertPopup e pela Home.
export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert precisa ser usado dentro de um AlertProvider');
  }
  return context;
}
