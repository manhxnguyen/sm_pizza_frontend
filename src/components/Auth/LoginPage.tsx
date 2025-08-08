import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Group,
  Stack,
  Alert,
  Container,
  Center,
  Anchor
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope, 
  faLock, 
  faPizzaSlice,
  faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const { login, state } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value: string) => {
        if (!value) return 'Email is required';
        if (!/^\S+@\S+$/.test(value)) return 'Invalid email format';
        return null;
      },
      password: (value: string) => {
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return null;
      },
    },
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      await login(values.email, values.password);
      
      // Redirect to intended page or dashboard
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container size="xs" h="100vh" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper 
        withBorder 
        shadow="md" 
        p={{ base: 20, sm: 30 }} 
        radius="md" 
        w="100%"
        maw={400}
      >
        <Center mb="xl">
          <Group align="center">
            <FontAwesomeIcon 
              icon={faPizzaSlice} 
              size="2x" 
              color="#fd7e14"
            />
            <div>
              <Title order={2} c="orange.7">
                Pizza Management
              </Title>
              <Text size="sm" c="dimmed">
                Sign in to your account
              </Text>
            </div>
          </Group>
        </Center>

        {state.error && (
          <Alert 
            color="red" 
            title="Login Failed"
            icon={<FontAwesomeIcon icon={faExclamationTriangle} />}
            mb="md"
          >
            {state.error}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Email"
              placeholder="your@email.com"
              required
              leftSection={<FontAwesomeIcon icon={faEnvelope} />}
              {...form.getInputProps('email')}
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              leftSection={<FontAwesomeIcon icon={faLock} />}
              {...form.getInputProps('password')}
            />

            <Button
              type="submit"
              fullWidth
              loading={isLoading}
              size="md"
              color="orange"
            >
              Sign In
            </Button>

            <Group justify="space-between" mt="sm">
              <Anchor size="sm" href="/forgot-password" c="orange">
                Forgot password?
              </Anchor>
              <Anchor size="sm" href="/register" c="orange">
                Create account
              </Anchor>
            </Group>

            <Text size="xs" c="dimmed" ta="center" mt="md">
              Demo accounts available:
              <br />
              Super Admin: admin@pizzashop.com / password123
              <br />
              Store Owner: owner@pizzashop.com / password123
              <br />
              Pizza Chef: chef@pizzashop.com / password123
            </Text>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginPage;
