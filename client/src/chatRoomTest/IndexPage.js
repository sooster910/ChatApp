import React from 'react';
import { withRouter } from 'react-router-dom';

const IndexPage = (props) => {
  React.useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      props.history.push('/login');
    } else {
      props.history.push('/chatroom');
    }
  }, []);
  return <div></div>;
};
export default withRouter(IndexPage);
