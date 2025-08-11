# Pizza Management System - Frontend

A modern React-based frontend application for managing pizza toppings and creating pizza masterpieces with role-based authentication and responsive design.

## Overview

This application provides an intuitive interface for pizza store management with three user roles:
- **Super Admin**: Full access to all features
- **Pizza Store Owner**: Can manage toppings and view pizzas  
- **Pizza Chef**: Can view toppings and manage pizzas

### Key Features
- JWT-based authentication with role-based access control
- CRUD operations for toppings and pizzas
- Responsive design for mobile/desktop
- Auto-logout on token expiration
- Permission-based UI components

## Quick Start

### Prerequisites
- Node.js (version 16+)
- npm or yarn
- Rails backend running on `http://localhost:3001`

### Installation & Setup

```bash
# 1. Clone and install dependencies
git clone <https://github.com/manhxnguyen/sm_pizza_frontend>
cd sm_pizza_frontend
npm install

# 2. Configure environment
cp [.env.example] .env
# Edit .env with your API URL: REACT_APP_API_URL=http://localhost:3001/api/v1

# 3. Start development server
npm start
# Application available at http://localhost:3000