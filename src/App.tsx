import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppShell, Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './pages/Dashboard';
import ToppingsPage from './pages/ToppingsPage';
import PizzasPage from './pages/PizzasPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import LoginPage from './components/Auth/LoginPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import { UserRole } from './types';

const AppContent: React.FC = () => {
  const { state } = useAuth();
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();

  // Show loading while checking authentication
  if (state.isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!state.isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <AppShell
      header={{ height: { base: 60, md: 70 } }}
      navbar={{ 
        width: { base: 200, md: 250 }, 
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened } 
      }}
      padding={{ base: 'sm', md: 'md' }}
    >
      <AppShell.Header>
        <Header mobileNavbarOpened={mobileOpened} toggleMobileNavbar={toggleMobile} />
      </AppShell.Header>
      
      <AppShell.Navbar>
        <Sidebar onNavigationClick={() => mobileOpened && toggleMobile()} />
      </AppShell.Navbar>
      
      <AppShell.Main>
        <Container size="xl" style={{ minHeight: 'calc(100vh - 70px)' }}>
          <Routes>
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/toppings" 
              element={
                <ProtectedRoute requiredRoles={[UserRole.SUPER_ADMIN, UserRole.PIZZA_STORE_OWNER, UserRole.PIZZA_CHEF]}>
                  <ToppingsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pizzas" 
              element={
                <ProtectedRoute requiredRoles={[UserRole.SUPER_ADMIN, UserRole.PIZZA_STORE_OWNER, UserRole.PIZZA_CHEF]}>
                  <PizzasPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
          </Routes>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/*" element={<AppContent />} />
    </Routes>
  );
}

export default App;
