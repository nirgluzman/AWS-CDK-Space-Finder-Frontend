import { SyntheticEvent, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService';

type LoginProps = {
  authService: AuthService;
  setUserNameCb: (userName: string) => void;
};

export default function Login({ authService, setUserNameCb }: LoginProps) {
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (userName && password) {
      const loginRespose = await authService.login(userName, password);

      if (loginRespose) {
        setUserNameCb(userName);
        setLoginSuccess(true);
      } else {
        setErrorMessage('invalid credentials');
        setLoginSuccess(false);
      }
    } else {
      setErrorMessage('Please fill all fields!');
    }
  };

  function renderLoginResult() {
    if (errorMessage) {
      return <label className='message'>{errorMessage}</label>;
    }
  }

  return (
    <div>
      {loginSuccess && (
        <Navigate
          to='/profile'
          replace={true} // the current entry in the history stack will be replaced with the new one.
        />
      )}
      <h2>Please login</h2>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label>User name</label>
        <input
          type='text'
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <br />
        <label>Password</label>
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <input // button for submitting the form.
          type='submit'
          value='Login'
        />
      </form>
      <br />
      {renderLoginResult()}
    </div>
  );
}
