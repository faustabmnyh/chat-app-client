import { IconButton, makeStyles, Popover, Typography } from "@material-ui/core";
import React from "react";
import { useAuthState } from "../context/auth";
import moment from "moment";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import { useMutation } from "@apollo/client";
import { REACT_TO_MESSAGE } from "../graphql/mutation/message";

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: "none",
  },
  paper: {
    padding: "5px",
    fontSize: "14px",
  },
}));

const Message = ({ message }) => {
  const { user } = useAuthState();
  const reactions = ["❤️", "😆", "😯", "😢", "😡", "👍", "👎"];
  const classes = useStyles();

  // popover created at
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  //   const received = !message.from === user.username

  // popover reaction
  const [anchorElReact, setAnchorElReact] = React.useState(null);

  const handleClick = (event) => {
    setAnchorElReact(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElReact(null);
  };

  const openReact = Boolean(anchorElReact);
  const id = openReact ? "simple-popover" : undefined;

  // onClick reaction
  const [reactToMessage] = useMutation(REACT_TO_MESSAGE, {
    onError: (err) => err,
    onCompleted: (data) => {
      setAnchorElReact(null);
    },
  });

  const handleReact = (react) => {
    reactToMessage({ variables: { uuid: message.uuid, content: react } });
  };

  console.log("this is message", message);
  return (
    <div
      className={
        message.from === user.username ? "main-message from" : "main-message"
      }
    >
      {message.from === user.username && (
        <InsertEmoticonIcon role="button" onClick={handleClick} />
      )}
      <div
        className={
          message.from === user.username
            ? "message-bubble from"
            : "message-bubble"
        }
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        {message.reactions.length > 0 && (
          <div
            className={
              message.from === user.username
                ? "reaction-content"
                : "reaction-content to"
            }
          >
            {message.reactions.map((r) => (
              <div key={r.uuid}>{r.content}</div>
            ))}
            {message.reactions.length > 0 && message.reactions.length}
          </div>
        )}

        <p key={message.uuid}>{message.content}</p>
        <Popover
          id="mouse-over-popover"
          className={classes.popover}
          classes={{
            paper: classes.paper,
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          <p>{moment(message.createdAt).format("MMMM DD, YYYY h:mm a")}</p>
        </Popover>
      </div>
      {message.from !== user.username && (
        <InsertEmoticonIcon role="button" onClick={handleClick} />
      )}
      <Popover
        id={id}
        open={openReact}
        anchorEl={anchorElReact}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <div className="reaction">
          {reactions.map((reaction) => (
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleReact(reaction)}
              className="reaction-icon"
            >
              {reaction}
            </IconButton>
          ))}
        </div>
      </Popover>
    </div>
  );
};

export default Message;
