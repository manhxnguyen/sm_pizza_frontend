import React, { useEffect } from 'react';
import { 
  Title, 
  Text, 
  SimpleGrid, 
  Card, 
  Group, 
  ThemeIcon,
  Stack,
  Loader,
  Alert,
  Button
} from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLeaf, 
  faPizzaSlice, 
  faUsers,
  faExclamationTriangle,
  faRefresh
} from '@fortawesome/free-solid-svg-icons';
import { useDashboard } from '../hooks/useDashboard';

const Dashboard: React.FC = () => {
  const { dashboardData, loading, error, lastUpdated, fetchDashboardData } = useDashboard();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const stats = [
    {
      title: 'Total Toppings',
      value: dashboardData?.statistics?.total_toppings?.toString() || '0',
      icon: faLeaf,
      color: 'green',
    },
    {
      title: 'Total Pizzas',
      value: dashboardData?.statistics?.total_pizzas?.toString() || '0',
      icon: faPizzaSlice,
      color: 'orange',
    },
    {
      title: 'Total Users',
      value: dashboardData?.statistics?.total_users?.toString() || '0',
      icon: faUsers,
      color: 'violet',
    },
  ];

  if (loading && !dashboardData) {
    return (
      <Stack align="center" justify="center" h="50vh">
        <Loader size="lg" />
        <Text>Loading dashboard data...</Text>
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack gap="xl">
        <div>
          <Title order={1} mb="md">
            Dashboard
          </Title>
        </div>
        <Alert
          icon={<FontAwesomeIcon icon={faExclamationTriangle} />}
          title="Error loading dashboard"
          color="red"
        >
          {error}
        </Alert>
      </Stack>
    );
  }

  return (
    <Stack gap="xl">
      <div>
        <Group justify="space-between" align="flex-start" wrap="wrap">
          <div style={{ flex: 1, minWidth: '250px' }}>
            <Title order={1} mb="md">
              Dashboard
            </Title>
            <Text c="dimmed">
              Welcome to the Pizza Management System. Manage your toppings and create amazing pizzas!
              {lastUpdated && (
                <><br />Last updated: {lastUpdated.toLocaleTimeString()}</>
              )}
            </Text>
          </div>
          <Button
            variant="light"
            leftSection={<FontAwesomeIcon icon={faRefresh} />}
            onClick={fetchDashboardData}
            loading={loading}
          >
            Refresh
          </Button>
        </Group>
      </div>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
        {stats.map((stat) => (
          <Card key={stat.title} withBorder p="lg" className="pizza-card">
            <Group justify="apart">
              <div>
                <Text c="dimmed" size="sm" fw={500}>
                  {stat.title}
                </Text>
                <Text fw={700} size="xl">
                  {stat.value}
                </Text>
              </div>
              <ThemeIcon
                color={stat.color}
                variant="light"
                size="lg"
                radius="md"
              >
                <FontAwesomeIcon icon={stat.icon} />
              </ThemeIcon>
            </Group>
          </Card>
        ))}
      </SimpleGrid>
    </Stack>
  );
};

export default Dashboard;
