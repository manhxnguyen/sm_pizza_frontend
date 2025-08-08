import React from 'react';
import { Group, Title, ActionIcon, useMantineColorScheme, Menu, Avatar, Text, Button, Burger } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPizzaSlice, 
  faMoon, 
  faSun, 
  faUser, 
  faSignOutAlt,
  faUserCircle
} from '@fortawesome/free-solid-svg-icons';
import { useAuth, getRoleDisplayName } from '../../contexts/AuthContext';

interface HeaderProps {
  mobileNavbarOpened: boolean;
  toggleMobileNavbar: () => void;
}

const Header: React.FC<HeaderProps> = ({ mobileNavbarOpened, toggleMobileNavbar }) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { state, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Group justify="space-between" h="100%" px={{ base: 'sm', md: 'md' }}>
      <Group>
        <Burger
          opened={mobileNavbarOpened}
          onClick={toggleMobileNavbar}
          hiddenFrom="sm"
          size="sm"
        />
        <FontAwesomeIcon 
          icon={faPizzaSlice} 
          size="lg" 
          color="#fd7e14"
        />
        <Title order={3} c="orange.7" visibleFrom="sm">
          Pizza Management System
        </Title>
        <Title order={4} c="orange.7" hiddenFrom="sm">
          Pizza Mgmt
        </Title>
      </Group>
      
      <Group>
        <ActionIcon
          variant="default"
          onClick={() => toggleColorScheme()}
          size="lg"
        >
          <FontAwesomeIcon 
            icon={colorScheme === 'dark' ? faSun : faMoon} 
          />
        </ActionIcon>

        {state.isAuthenticated && state.user && (
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button variant="subtle" leftSection={
                <Avatar size="sm" radius="xl">
                  <FontAwesomeIcon icon={faUserCircle} />
                </Avatar>
              }>
                <div style={{ textAlign: 'left' }}>
                  <Text size="sm" fw={500}>
                    {state.user.full_name || state.user.name}
                  </Text>
                  <Text size="xs" c="dimmed" visibleFrom="sm">
                    {getRoleDisplayName(state.user.role)}
                  </Text>
                </div>
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Account</Menu.Label>
              <Menu.Item leftSection={<FontAwesomeIcon icon={faUser} />}>
                Profile Settings
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item 
                leftSection={<FontAwesomeIcon icon={faSignOutAlt} />}
                color="red"
                onClick={handleLogout}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>
    </Group>
  );
};

export default Header;
