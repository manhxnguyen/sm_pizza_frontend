import React, { useEffect } from 'react';
import {
  Title,
  Button,
  Stack,
  Group,
  Card,
  Text,
  Badge,
  ActionIcon,
  Loader,
  Alert,
  SimpleGrid
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faLeaf,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { useToppings } from '../hooks/useToppings';
import ToppingForm from '../components/Toppings/ToppingForm';
import PermissionGuard from '../components/Auth/PermissionGuard';
import { Topping } from '../types';

const ToppingsPage: React.FC = () => {
  const { 
    toppings, 
    loading, 
    error, 
    fetchToppings, 
    deleteTopping 
  } = useToppings();

  useEffect(() => {
    fetchToppings();
  }, [fetchToppings]);

  const handleCreateTopping = () => {
    modals.open({
      title: 'Create New Topping',
      children: (
        <ToppingForm
          onSuccess={() => {
            modals.closeAll();
          }}
        />
      ),
    });
  };

  const handleEditTopping = (topping: Topping) => {
    modals.open({
      title: 'Edit Topping',
      children: (
        <ToppingForm
          topping={topping}
          onSuccess={() => {
            modals.closeAll();
          }}
        />
      ),
    });
  };

  const handleDeleteTopping = (topping: Topping) => {
    modals.openConfirmModal({
      title: 'Delete Topping',
      children: (
        <Stack gap="sm">
          <Text>
            Are you sure you want to delete <strong>{topping.name}</strong>?
          </Text>
          <Text size="sm" c="dimmed">
            Note: Toppings that are currently used by existing pizzas cannot be deleted.
            You'll need to remove them from all pizzas first.
          </Text>
        </Stack>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteTopping(topping.id);
        } catch (error) {
          // Error is already handled in the hook
          console.error('Failed to delete topping:', error);
        }
      },
    });
  };

  if (loading && toppings.length === 0) {
    return (
      <Stack align="center" justify="center" h="50vh">
        <Loader size="lg" />
        <Text>Loading toppings...</Text>
      </Stack>
    );
  }

  return (
    <Stack gap="xl">
      <div>
        <Group justify="space-between" align="flex-start" mb="md" className="page-header mobile-header-spacing">
          <div className="page-header-content">
            <Title order={1} mb="xs">
              Manage Toppings
            </Title>
            <Text c="dimmed">
              Add, edit, or remove pizza toppings for your pizza creations.
            </Text>
          </div>
          <PermissionGuard requiredPermissions={['canCreateToppings']}>
            <Button
              leftSection={<FontAwesomeIcon icon={faPlus} />}
              onClick={handleCreateTopping}
              size="md"
              className="page-header-button"
            >
              Add Topping
            </Button>
          </PermissionGuard>
        </Group>
      </div>

      {/* Only show Alert for critical errors that need user attention */}
      {error && error.includes('fetch') && (
        <Alert 
          color="red" 
          title="Connection Error"
          icon={<FontAwesomeIcon icon={faExclamationTriangle} />}
          withCloseButton
          onClose={() => {
            // Clear the error when user dismisses
            // You could add a clearError function to the hook
          }}
        >
          Unable to load toppings. Please check your connection and try again.
        </Alert>
      )}

      {toppings.length === 0 && !loading ? (
        <Card withBorder p="xl" ta="center">
          <FontAwesomeIcon 
            icon={faLeaf} 
            size="3x" 
            className="text-gray-300 mb-4" 
          />
          <Title order={3} mb="md">
            No toppings yet
          </Title>
          <Text c="dimmed" mb="lg">
            Start by adding your first topping to get started with pizza creation.
          </Text>
          <PermissionGuard requiredPermissions={['canCreateToppings']}>
            <Button
              leftSection={<FontAwesomeIcon icon={faPlus} />}
              onClick={handleCreateTopping}
            >
              Add Your First Topping
            </Button>
          </PermissionGuard>
        </Card>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
          {toppings.map((topping) => (
            <Card 
              key={topping.id} 
              withBorder 
              p="md" 
              className="pizza-card"
            >
              <Group justify="space-between" mb="md">
                <Badge 
                  color="green" 
                  variant="light"
                  leftSection={<FontAwesomeIcon icon={faLeaf} />}
                >
                  Topping
                </Badge>
                <Group gap="xs">
                  <PermissionGuard requiredPermissions={['canUpdateToppings', 'canDeleteToppings']}>
                    <ActionIcon
                      variant="light"
                      color="blue"
                      onClick={() => handleEditTopping(topping)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </ActionIcon>
                    <ActionIcon
                      variant="light"
                      color="red"
                      onClick={() => handleDeleteTopping(topping)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </ActionIcon>
                  </PermissionGuard>
                </Group>
              </Group>
              
              <Text fw={500} size="lg" mb="xs">
                {topping.name}
              </Text>
              
              {topping.formatted_price && (
                <Text fw={600} size="md" c="green" mb="xs">
                  {topping.formatted_price}
                </Text>
              )}
              
              <Text size="sm" c="dimmed">
                Created: {new Date(topping.created_at).toLocaleDateString()}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
};

export default ToppingsPage;
