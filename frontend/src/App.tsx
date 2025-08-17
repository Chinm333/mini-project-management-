import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './apollo/client';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="bg-primary-600 text-white shadow-lg" style={{ textAlign: 'center' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold">Project Management System</h1>
              <div className="text-sm text-primary-100">
                Multi-tenant project management tool
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ padding: '40px' }}>
          <Dashboard />
        </main>
      </div>
    </ApolloProvider>
  );
}

export default App;
