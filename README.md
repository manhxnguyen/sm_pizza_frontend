# # Pizza Management System - Frontend

A modern React-based frontend application for managing pizza toppings and creating pizza masterpieces. This application provides an intuitive interface for pizza store owners to manage toppings and pizza chefs to create delicious pizzas.

## 🍕 Features

### Authentication & Authorization

- **JWT Token-based Authentication**: Secure login with token-based session management
- **Role-based Access Control**: Three distinct user roles with specific permissions
  - **Super Admin**: Full access to all features (toppings, pizzas, users)
  - **Pizza Store Owner**: Can manage toppings and pizzas
  - **Pizza Chef**: Can only manage pizzas (pizza masterpieces)
- **Protected Routes**: Role-specific access to different sections
- **Session Management**: Automatic token validation and refresh

### Manage Toppings (Super Admin & Store Owner Only)

- **View Toppings**: See a comprehensive list of available toppings
- **Add New Toppings**: Create new toppings with validation
- **Edit Toppings**: Update existing topping information
- **Delete Toppings**: Remove toppings with confirmation
- **Duplicate Prevention**: Prevents duplicate toppings from being added

### Manage Pizzas (All Authenticated Users)

- **View Pizzas**: See all existing pizzas with their toppings
- **Create Pizzas**: Design new pizzas by selecting from available toppings
- **Edit Pizzas**: Update pizza names and modify toppings
- **Delete Pizzas**: Remove pizzas with confirmation
- **Duplicate Prevention**: Prevents duplicate pizza names

### User Interface

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Built with Mantine components and TailwindCSS
- **Intuitive Navigation**: Easy-to-use sidebar navigation with role-based menu items
- **Visual Feedback**: Loading states, success messages, and error handling
- **Dark/Light Mode**: Toggle between color schemes
- **User Profile**: Display current user info and role in header

## 🚀 Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **UI Components**: Mantine UI Library
- **Styling**: TailwindCSS with custom pizza-themed colors
- **Icons**: Font Awesome
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Testing**: Jest + React Testing Library
- **State Management**: React Context API with useReducer

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **Ruby on Rails Backend** running on `http://localhost:3001`

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd sm_pizza_frontend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` file with your backend API URL:

```env
REACT_APP_API_URL=http://localhost:3001/api/v1
REACT_APP_ENV=development
```

### 4. Start the Development Server

```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`

## 🧪 Running Tests

### Run All Tests

```bash
npm test
# or
yarn test
```

### Run Tests with Coverage

```bash
npm run test:coverage
# or
yarn test:coverage
```

### Test Structure

- **Unit Tests**: Individual component and hook testing
- **Integration Tests**: API integration and user flow testing
- **Coverage**: Comprehensive test coverage for all major functionalities

## 🏗️ Building for Production

### Create Production Build

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `build/` directory.

### Deployment

This application can be deployed to any static hosting service:

- **Netlify**: Connect your repository for automatic deployments
- **Vercel**: Deploy with zero configuration
- **AWS S3 + CloudFront**: For scalable hosting
- **GitHub Pages**: For simple deployments

## 🏛️ Architecture & Design

### Component Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Layout components (Header, Sidebar)
│   ├── Toppings/       # Topping-specific components
│   └── Pizzas/         # Pizza-specific components
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API service layer
├── types/              # TypeScript type definitions
└── __tests__/          # Test files
```

### State Management

The application uses React Context API with useReducer for predictable state management:

- **ApiContext**: Manages toppings and pizzas data
- **Custom Hooks**: Encapsulate API logic (useToppings, usePizzas)
- **Local State**: Component-specific state for forms and UI

### API Integration

- **Service Layer**: Centralized API calls with error handling
- **Type Safety**: Full TypeScript integration with API responses
- **Error Handling**: User-friendly error messages and notifications
- **Loading States**: Visual feedback during API operations

### Testing Strategy

- **Component Testing**: Every component has corresponding tests
- **Hook Testing**: Custom hooks are thoroughly tested
- **API Mocking**: Tests use mocked API responses
- **Coverage**: Maintain high test coverage for reliability

## 🎨 Design Decisions

### UI/UX Choices

1. **Mantine UI**: Chosen for its comprehensive component library and accessibility features
2. **TailwindCSS**: Provides utility-first styling with custom pizza-themed colors
3. **Responsive Design**: Mobile-first approach ensuring usability across devices
4. **Color Scheme**: Pizza-themed orange color palette with professional appearance

### Technical Choices

1. **TypeScript**: Ensures type safety and better developer experience
2. **React Router**: Provides client-side routing for SPA functionality
3. **Context API**: Lightweight state management without external dependencies
4. **Axios**: Robust HTTP client with interceptors for consistent API handling

### Performance Optimizations

1. **Code Splitting**: Lazy loading of components
2. **Memoization**: Strategic use of useMemo and useCallback
3. **Bundle Optimization**: Efficient bundling with Create React App
4. **Image Optimization**: Responsive images and icons

## � Authentication & User Roles

The application implements JWT-based authentication with three distinct user roles:

### User Roles & Permissions

1. **Super Admin** (`super_admin`)

   - ✅ Manage Toppings (Create, Read, Update, Delete)
   - ✅ Manage Pizzas (Create, Read, Update, Delete)
   - ✅ User Management (Future feature)
   - ✅ Full Dashboard Access

2. **Pizza Store Owner** (`pizza_store_owner`)

   - ✅ Manage Toppings (Create, Read, Update, Delete)
   - ✅ Manage Pizzas (Create, Read, Update, Delete)
   - ❌ User Management
   - ✅ Dashboard Access

3. **Pizza Chef** (`pizza_chef`)
   - ❌ Manage Toppings (Read-only access)
   - ✅ Manage Pizzas (Create, Read, Update, Delete)
   - ❌ User Management
   - ✅ Dashboard Access

### Demo Accounts

For testing purposes, you can use these demo accounts:

```
Super Admin:
Email: admin@pizza.com
Password: password

Pizza Store Owner:
Email: owner@pizza.com
Password: password

Pizza Chef:
Email: chef@pizza.com
Password: password
```

### Backend Integration

The frontend expects the following authentication endpoints from the Rails backend:

- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user info
- `POST /api/v1/auth/refresh` - Refresh JWT token

All API requests include the JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Toppings Endpoints

- `GET /api/v1/toppings` - Fetch all toppings
- `POST /api/v1/toppings` - Create new topping
- `PUT /api/v1/toppings/:id` - Update topping
- `DELETE /api/v1/toppings/:id` - Delete topping

### Pizzas Endpoints

- `GET /api/v1/pizzas` - Fetch all pizzas
- `POST /api/v1/pizzas` - Create new pizza
- `PUT /api/v1/pizzas/:id` - Update pizza
- `DELETE /api/v1/pizzas/:id` - Delete pizza

## 🚀 Deployment Guide

### Environment Setup

1. **Production Environment Variables**:

   ```env
   REACT_APP_API_URL=https://your-backend-api.com/api/v1
   REACT_APP_ENV=production
   ```

2. **Build the Application**:

   ```bash
   npm run build
   ```

3. **Deploy to Your Platform**:
   - Upload the `build/` directory to your hosting service
   - Configure routing for SPA (single-page application)
   - Set up HTTPS and custom domain if needed

### Recommended Hosting Platforms

- **Netlify**: Automatic deployments from Git
- **Vercel**: Zero-config deployments
- **AWS Amplify**: Integrated with AWS services
- **GitHub Pages**: Simple and free

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Future Enhancements

- **Pizza Categories**: Organize pizzas by categories (vegetarian, meat lovers, etc.)
- **Nutritional Information**: Add calorie and nutritional data for toppings
- **Customer Reviews**: Allow customers to rate and review pizzas
- **Order Management**: Integrate with ordering system
- **Analytics Dashboard**: Business insights and popular topping combinations
- **Multi-language Support**: Internationalization for global deployment
