import { useSubscription } from "@apollo/client";
import { Box, Button, Container, Grid, makeStyles } from "@material-ui/core";
import { useEffect } from "react";
import Messages from "../../Components/Messages";
import Users from "../../Components/Users";
import { useAuthDispatch, useAuthState } from "../../context/auth";
import { useMessageDispatch } from "../../context/message";
import { NEW_MESSAGE, NEW_REACTION } from "../../graphql/subscription/messages";

const useStyles = makeStyles(() => ({
  container: {
    background: "white",
    padding: "2rem",
    marginTop: "2rem",
    borderRadius: "15px",
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.05)",
  },
}));

const Home = () => {
  const classes = useStyles();
  const dispatch = useAuthDispatch();
  const { user } = useAuthState();
  const dispatchMessage = useMessageDispatch();
  const { data: dataMessage, error: errorMessage } = useSubscription(
    NEW_MESSAGE
  );
  const { data: dataReaction, error: errorReaction } = useSubscription(
    NEW_REACTION
  );

  useEffect(() => {
    if (errorMessage) {
      console.log(errorMessage);
    }
    if (dataMessage) {
      const message = dataMessage.newMessage;
      const otherUser =
        user.username === message.to ? message.from : message.to;
      dispatchMessage({
        type: "ADD_MESSAGE",
        payload: {
          username: otherUser,
          message,
        },
      });
    }
  }, [dataMessage, errorMessage]);

  useEffect(() => {
    if (errorReaction) {
      console.log(errorReaction);
    }
    if (dataReaction) {
      const reaction = dataReaction.newReaction;
      const otherUser =
        user.username === reaction.message.to
          ? reaction.message.from
          : reaction.message.to;
      dispatchMessage({
        type: "ADD_REACTION",
        payload: {
          username: otherUser,
          reaction,
        },
      });
    }
  }, [dataReaction, errorReaction]);

  const handleLogout = () => {
    dispatch({
      type: "LOGOUT",
    });
    window.location.href = "/login";
  };

  return (
    <Container className={classes.container}>
      <Grid container direction="row">
        <Box display="flex" justifyContent="space-between" width="100%">
          <div>
            <h2>Chat App</h2>
          </div>
          <Button onClick={handleLogout} variant="contained" color="primary">
            Logout
          </Button>
        </Box>
      </Grid>
      <Box marginTop="20px">
        <Grid container direction="row">
          <Grid container direction="column" item md={4} xs={12}>
            <Users />
          </Grid>
          <Grid container direction="column" item md={8} xs={12}>
            <Messages />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
