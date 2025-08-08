import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requiredPermissions?: (keyof ReturnType<typeof import('../../contexts/AuthContext').getPermissions>)[];
  fallback?: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  children, 
  requiredRoles = [],
  requiredPermissions = [],
  fallback = null
}) => {
  const { state, permissions } = useAuth();

  // Don't render if not authenticated
  if (!state.isAuthenticated || !state.user) {
    return <>{fallback}</>;
  }

  // Check role-based access
  if (requiredRoles.length > 0 && !requiredRoles.includes(state.user.role)) {
    return <>{fallback}</>;
  }

  // Check permission-based access
  if (requiredPermissions.length > 0) {
    const hasPermission = requiredPermissions.some(permission => 
      permissions[permission] === true
    );
    
    if (!hasPermission) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
};

export default PermissionGuard;
