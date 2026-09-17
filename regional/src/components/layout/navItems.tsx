import type { ReactNode } from 'react';
import {
  AppstoreOutlined,
  MedicineBoxOutlined,
  BankOutlined,
  InboxOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

export interface NavItem {
  key: string;
  label: string;
  icon: ReactNode;
  path: string;
}

export const mainNavItems: NavItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: <AppstoreOutlined />,
    path: '/dashboard',
  },
  {
    key: 'ubs',
    label: 'UBSs',
    icon: <MedicineBoxOutlined />,
    path: '/ubs',
  },
  {
    key: 'clinicas-privadas',
    label: 'Clínicas Privadas',
    icon: <BankOutlined />,
    path: '/clinicas-privadas',
  },
  {
    key: 'relatorio-regional',
    label: 'Relatório Regional',
    icon: <InboxOutlined />,
    path: '/relatorio-regional',
  },
];

export const bottomNavItems: NavItem[] = [
  {
    key: 'configuracoes',
    label: 'Configurações',
    icon: <SettingOutlined />,
    path: '/configuracoes',
  },
  {
    key: 'sair',
    label: 'Sair',
    icon: <LogoutOutlined />,
    path: '/login',
  },
];