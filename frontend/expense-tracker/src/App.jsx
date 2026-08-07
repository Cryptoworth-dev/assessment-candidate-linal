import React from 'react';
import Dashboard from './components/Dashboard';
import expensifyLogo from './assets/expensify_logo.png';

function App() {
  return (
    <div>
      <nav className="top-nav">
        <div className="nav-left">
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={expensifyLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          Expensify
        </div>
        <div className="nav-right">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden' }}>
              <img src="https://ui-avatars.com/api/?name=User&background=random" alt="Profile" style={{ width: '100%' }} />
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Sign Out</span>
          </div>
        </div>
      </nav>
      <Dashboard />
      <footer>
        © 2024 Expensify Pro. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
