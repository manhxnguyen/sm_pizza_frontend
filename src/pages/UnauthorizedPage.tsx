import React from 'react';
import { Container, Title, Text, Button, Center, Stack } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container size="sm" h="100vh" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Center w="100%">
        <Stack align="center" gap="xl" ta="center">
          <FontAwesomeIcon 
            icon={faExclamationTriangle} 
            size="4x" 
            color="#fa5252"
          />
          
          <Title order={1}>
            Access Denied
          </Title>
          
          <Text size="lg" c="dimmed" maw={400}>
            You don't have permission to access this page.
            Please contact your administrator if you believe this is an error.
          </Text>
          
          <Button 
            onClick={() => navigate('/')}
            size="md"
            color="orange"
          >
            Go to Dashboard
          </Button>
        </Stack>
      </Center>
    </Container>
  );
};

export default UnauthorizedPage;
