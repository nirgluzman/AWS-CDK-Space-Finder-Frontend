import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import NavBar from './components/NavBar';
import Login from './components/Login';

import { AuthService } from './services/AuthService';

const authService = new AuthService();

function App() {
  const [userName, setUserName] = useState<string | undefined>(undefined);

  return (
    <div className='wrapper'>
      <NavBar userName={userName} />
      <Routes>
        <Route
          path='/'
          element={<div>Home</div>}
        />
        <Route
          path='/login'
          element={
            <Login
              authService={authService}
              setUserNameCb={setUserName}
            />
          }
        />
        <Route
          path='/profile'
          element={<div>Profile page</div>}
        />
        <Route
          path='/createSpace'
          element={<div>Create space page</div>}
        />
        <Route
          path='/spaces'
          element={<div>Spaces page</div>}
        />
      </Routes>
    </div>
  );
}

export default App;
