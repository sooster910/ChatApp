import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import LeftNaviContainer from '../container/LeftNaviContainer';
import DashBoardContainer from '../container/DashBoardContainer';

const WrapperDiv = styled.div`
  display: flex;
  width: 100%;
`;

const MainPage = ({ match, socket }) => {
  return (
    <WrapperDiv>
      <LeftNaviContainer socket={socket} />
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
