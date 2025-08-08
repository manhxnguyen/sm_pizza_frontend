import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';

// Import Mantine styles
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import App from './App';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { ApiProvider } from './contexts/ApiContext';

// Font Awesome setup
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
library.add(fas);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <MantineProvider
        theme={{
          primaryColor: 'orange',
          colors: {
            pizza: [
              '#fef7ed',
              '#fdead5',
              '#f9d2aa',
              '#f4b274',
              '#ed883c',
              '#e76b1a',
              '#d85410',
              '#b34210',
              '#8f3514',
              '#732d13',
            ],
          },
        }}
      >
        <AuthProvider>
          <ApiProvider>
            <ModalsProvider modalProps={{
              centered: true,
              size: 'md',
              overlayProps: {
                backgroundOpacity: 0.55,
                blur: 3,
              },
            }}>
              <Notifications />
              <App />
            </ModalsProvider>
          </ApiProvider>
        </AuthProvider>
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>
);
