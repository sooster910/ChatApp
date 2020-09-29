import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import NavBarContainer from '../container/NavBarContainer';
import DashBoardContainer from '../container/DashBoardContainer';

const WrapperDiv = styled.div`
  position: absolute;
  display: flex;
  width: 85%;
  height: 85vh;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(206, 195, 223, 0.1);
`;

const MainPage = ({ match, socket }) => {
  return (
    <WrapperDiv>
      <NavBarContainer socket={socket} />
      <Switch>
        <Route
          path={[match.path, `${match.path}/dashboard`]}
          render={() => <DashBoardContainer socket={socket} />}
        />
        {/* 그 외 Route들 설정 */}
      </Switch>
    </WrapperDiv>
  );
};

export default withRouter(MainPage);
