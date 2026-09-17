import type { ReactNode } from 'react';
import {
  AppstoreOutlined,
  TeamOutlined,
  InboxOutlined,
  SwapOutlined,
  SettingOutlined,
  LogoutOutlined,
  NotificationOutlined,
} from '@ant-design/icons';

export interface NavItem {
  label: string;
  icon: ReactNode;
  path: string;
}

export const mainNavItems: NavItem[] = [
  { label: 'Dashboard', icon: <AppstoreOutlined />, path: '/dashboard' },
  { label: 'Profissionais', icon: <TeamOutlined />, path: '/profissionais' },
  { label: 'Estoque', icon: <InboxOutlined />, path: '/estoque' },
  { label: 'Movimentações', icon: <SwapOutlined />, path: '/movimentacoes' },
  { label: 'Campanhas & Alertas', icon: <NotificationOutlined />, path: '/campanhas' },
];

export const bottomNavItems: NavItem[] = [
  { label: 'Configurações', icon: <SettingOutlined />, path: '/configuracoes' },
  { label: 'Sair', icon: <LogoutOutlined />, path: '/login' },
];
