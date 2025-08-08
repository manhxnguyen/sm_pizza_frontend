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
  faPizzaSlice,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { usePizzas } from '../hooks/usePizzas';
import { useToppings } from '../hooks/useToppings';
import PizzaForm from '../components/Pizzas/PizzaForm';
import PermissionGuard from '../components/Auth/PermissionGuard';
import { Pizza } from '../types';

const PizzasPage: React.FC = () => {
  const { 
    pizzas, 
    loading: pizzasLoading, 
    error: pizzasError, 
    fetchPizzas, 
    deletePizza 
  } = usePizzas();

  const {
    toppings,
    fetchToppings
  } = useToppings();

  useEffect(() => {
    fetchPizzas();
    fetchToppings();
  }, [fetchPizzas, fetchToppings]);

  const handleCreatePizza = () => {
    modals.open({
      title: 'Create New Pizza',
      size: 'lg',
      centered: true,
      closeOnClickOutside: false,
      children: (
        <PizzaForm
          availableToppings={toppings}
          onSuccess={() => {
            modals.closeAll();
          }}
        />
      ),
    });
  };

  const handleEditPizza = (pizza: Pizza) => {
    modals.open({
      title: 'Edit Pizza',
      size: 'lg',
      centered: true,
      closeOnClickOutside: false,
      children: (
        <PizzaForm
          pizza={pizza}
          availableToppings={toppings}
          onSuccess={() => {
            modals.closeAll();
          }}
        />
      ),
    });
  };

  const handleDeletePizza = (pizza: Pizza) => {
    modals.openConfirmModal({
      title: 'Delete Pizza',
      children: (
        <Text>
          Are you sure you want to delete <strong>{pizza.name}</strong>? 
          This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deletePizza(pizza.id),
    });
  };

  if (pizzasLoading && pizzas.length === 0) {
    return (
      <Stack align="center" justify="center" h="50vh">
        <Loader size="lg" />
        <Text>Loading pizzas...</Text>
      </Stack>
    );
  }

  return (
    <Stack gap="xl">
      <div>
        <Group justify="space-between" align="flex-start" mb="md" className="page-header mobile-header-spacing">
          <div className="page-header-content">
            <Title order={1} mb="xs">
              Manage Pizzas
            </Title>
            <Text c="dimmed">
              Create, edit, and manage your pizza masterpieces.
            </Text>
          </div>
          <PermissionGuard requiredPermissions={['canCreatePizzas']}>
            <Button
              leftSection={<FontAwesomeIcon icon={faPlus} />}
              onClick={handleCreatePizza}
              size="md"
              disabled={toppings.length === 0}
              className="page-header-button"
            >
              Create Pizza
            </Button>
          </PermissionGuard>
        </Group>
      </div>

      {pizzasError && pizzasError.includes('fetch') && (
        <Alert 
          color="red" 
          title="Connection Error"
          icon={<FontAwesomeIcon icon={faExclamationTriangle} />}
          withCloseButton
          onClose={() => {/* Clear error if needed */}}
        >
          {pizzasError}
        </Alert>
      )}

      {toppings.length === 0 && (
        <Alert color="orange" title="No Toppings Available">
          You need to add some toppings before you can create pizzas. 
          <Button variant="subtle" size="sm" ml="md">
            Add Toppings First
          </Button>
        </Alert>
      )}

      {pizzas.length === 0 && !pizzasLoading ? (
        <Card withBorder p="xl" ta="center">
          <FontAwesomeIcon 
            icon={faPizzaSlice} 
            size="3x" 
            className="text-gray-300 mb-4" 
          />
          <Title order={3} mb="md">
            No pizzas yet
          </Title>
          <Text c="dimmed" mb="lg">
            Start creating your first pizza masterpiece!
          </Text>
          <PermissionGuard requiredPermissions={['canCreatePizzas']}>
            <Button
              leftSection={<FontAwesomeIcon icon={faPlus} />}
              onClick={handleCreatePizza}
              disabled={toppings.length === 0}
            >
              Create Your First Pizza
            </Button>
          </PermissionGuard>
        </Card>
      ) : (
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
          {pizzas.map((pizza) => (
            <Card 
              key={pizza.id} 
              withBorder 
              p="lg" 
              className="pizza-card"
            >
              <Group justify="space-between" mb="md">
                <Badge 
                  color="orange" 
                  variant="light"
                  leftSection={<FontAwesomeIcon icon={faPizzaSlice} />}
                >
                  Pizza
                </Badge>
                <Group gap="xs">
                  <PermissionGuard requiredPermissions={['canUpdatePizzas', 'canDeletePizzas']}>
                    <ActionIcon
                      variant="light"
                      color="blue"
                      onClick={() => handleEditPizza(pizza)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </ActionIcon>
                    <ActionIcon
                      variant="light"
                      color="red"
                      onClick={() => handleDeletePizza(pizza)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </ActionIcon>
                  </PermissionGuard>
                </Group>
              </Group>
              
              <Text fw={500} size="xl" mb="sm">
                {pizza.name}
              </Text>
              
              {pizza.description && (
                <Text size="sm" c="dimmed" mb="md">
                  {pizza.description}
                </Text>
              )}
              
              {pizza.total_price && (
                <Group justify="space-between" mb="md">
                  <Text size="lg" fw={600} c="orange">
                    Total: ${pizza.total_price}
                  </Text>
                </Group>
              )}
              
              <div>
                <Text size="sm" fw={500} mb="xs">
                  Toppings ({pizza.toppings?.length || 0}):
                </Text>
                <Group gap="xs" mb="md">
                  {pizza.toppings && pizza.toppings.length > 0 ? (
                    pizza.toppings.map((topping) => (
                      <span 
                        key={topping.id}
                        className="topping-badge"
                        title={topping.formatted_price ? `Price: ${topping.formatted_price}` : undefined}
                      >
                        {topping.name}
                      </span>
                    ))
                  ) : (
                    <Text size="sm" c="dimmed">
                      No toppings
                    </Text>
                  )}
                </Group>
              </div>
              
              <Text size="sm" c="dimmed">
                Created: {new Date(pizza.created_at).toLocaleDateString()}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
};

export default PizzasPage;
