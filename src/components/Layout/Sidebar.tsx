import React from 'react';
import { NavLink, Stack, ScrollArea } from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faLeaf, 
  faPizzaSlice
} from '@fortawesome/free-solid-svg-icons';
import PermissionGuard from '../Auth/PermissionGuard';

interface SidebarProps {
  onNavigationClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigationClick }) => {
  const location = useLocation();

  const navItems = [
    {
      label: 'Dashboard',
      path: '/',
      icon: faHome,
      requiredPermissions: ['canViewDashboard' as const],
    },
    {
      label: 'Manage Toppings',
      path: '/toppings',
      icon: faLeaf,
      requiredPermissions: ['canViewToppings' as const],
    },
    {
      label: 'Manage Pizzas',
      path: '/pizzas',
      icon: faPizzaSlice,
      requiredPermissions: ['canViewPizzas' as const],
    }
  ];

  return (
    <ScrollArea h="100%">
      <Stack gap="xs" p="md">
        {navItems.map((item) => (
          <PermissionGuard 
            key={item.path}
            requiredPermissions={item.requiredPermissions}
          >
            <NavLink
              component={Link}
              to={item.path}
              label={item.label}
              leftSection={
                <FontAwesomeIcon 
                  icon={item.icon} 
                  className="w-4 h-4" 
                />
              }
              active={location.pathname === item.path}
              className="rounded-md"
              onClick={() => {
                // Close mobile menu when navigation item is clicked
                onNavigationClick?.();
              }}
            />
          </PermissionGuard>
        ))}
      </Stack>
    </ScrollArea>
  );
};

export default Sidebar;
