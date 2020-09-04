import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MainPage from './pages/MainPage';
import './styles/App.scss';
import io from 'socket.io-client';

const App = () => {
  const [socket, setSocket] = React.useState(null);

  // login 이후는 socket에 연결 된 상태여야 한다.
  const setupSocket = () => {
    const access_token = localStorage.getItem('access_token');
    const io_token = localStorage.getItem('io_token');

    if (access_token && io_token && !socket) {
      const newSocket = io(`localhost:4000/${io_token}`, {
        transports: ['websocket'],
        query: {
          token: access_token,
        },
      });

      newSocket.on('disconnect', (reason) => {
        setSocket(null);
        if (reason === 'io client disconnect') {
          console.log('socket disconnect success');
        } else {
          alert('error disconnected');
          setTimeout(setupSocket, 3000);
          // socket.connect();
        }
      });

      newSocket.on('connect', () => {
        alert('success new socketConnect');
      });

      setSocket(newSocket);
    }
  };

  React.useEffect(() => {
    setupSocket();
  }, []);

  return (
    <Router>
      <Switch>
        <Route path="/" component={IndexPage} exact />
        <Route
          path="/login"
          render={() => <LoginPage setupSocket={setupSocket} />}
          exact
        />
        <Route path="/signup" render={() => <SignupPage />} exact />
        <Route path="/main" render={() => <MainPage socket={socket} />} />
        <Route
          render={({ location }) => (
            <div>
              <h1>4 0 4</h1>
              <p>{location.pathname}는 없는 주소입니다</p>
            </div>
          )}
        />
      </Switch>
    </Router>
  );
};

export default App;
