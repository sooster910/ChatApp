import React, { useState, Fragment } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import AddBoxIcon from '@material-ui/icons/AddBox';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'grid',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  selectedChannel: {
    border: '3px solid rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    padding: 5,
  },
  channel: {
    border: '3px solid rgba(0, 0, 0, 0)',
    borderRadius: 10,
    padding: 5,
  },
}));

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: `${theme.palette.primary.light}`,
    border: `2px solid ${theme.palette.background.paper}`,
    borderRadius: 15,
    width: 15,
    height: 15,
  },
}))(Badge);

const StyledAvatar = withStyles((theme) => ({
  avatar: {
    cursor: 'pointer',
    background: 'black',
  },
}))(Avatar);

const StyledButton = withStyles(() => ({}))(Button);

const Drawer = ({ channelList, currentChannel }) => {
  const [toggle, setToggle] = useState(false);
  const classes = useStyles();

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setToggle(open);
  };

  const list = () => (
    <div onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <List>
        <div className={classes.root}>
          {channelList.map((channel) => (
            <StyledButton>
              <StyledBadge
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                invisible={channel.name === 'JobChannel' ? true : false} // 체널에 알림이 생기면 이 부분 수정
                overlap="circle"
                key={channel._id}
                className={
                  channel._id === currentChannel
                    ? classes.selectedChannel
                    : classes.channel
                }
                // onClick={() => changeChannel(channel._id)}
              >
                <StyledAvatar variant="rounded" key={channel._id}>
                  {channel.name}
                </StyledAvatar>
              </StyledBadge>
            </StyledButton>
          ))}
          <StyledBadge className={classes.channel}>
            <StyledAvatar variant="rounded">
              <AddBoxIcon fontSize="large" />
            </StyledAvatar>
          </StyledBadge>
        </div>
      </List>
    </div>
  );

  return (
    <div>
      <Fragment>
        <Button onClick={toggleDrawer(true)}>LEFT</Button>
        <SwipeableDrawer
          anchor="left"
          open={toggle}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
        >
          {list()}
        </SwipeableDrawer>
      </Fragment>
    </div>
  );
};

export default Drawer;
