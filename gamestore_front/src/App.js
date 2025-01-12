import React from 'react';
import { RouterProvider } from 'react-router-dom';
import root from './router/root';
import { AuthProvider } from './AuthContext'; // AuthProvider 임포트
import { ChatProvider } from './ChatContext';

function App() {
  return (
      <AuthProvider>
        <ChatProvider>
          <RouterProvider router={root} />
        </ChatProvider>
      </AuthProvider>
  );
}

export default App;
