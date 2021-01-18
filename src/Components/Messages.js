import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useMessageDispatch, useMessageState } from "../context/message";
import { SEND_MESSAGE } from "../graphql/mutation/message";
import { GET_MESSAGES } from "../graphql/query/messages";
import Message from "./Message";
import SendIcon from "@material-ui/icons/Send";


const Messages = () => {
  const dispatch = useMessageDispatch();
  const { users } = useMessageState();
  const [content, setContent] = useState("");
  const selectedUser = users?.find((u) => u.selected);
  const messages = selectedUser?.messages;
  const [
    getMessages,
    { loading: loadingMessages, data: dataMessages },
  ] = useLazyQuery(GET_MESSAGES);
  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onError: (err) => console.log(err),
    // we move to ws
    // onCompleted: (data) =>
    //   dispatch({
    //     type: "ADD_MESSAGE",
    //     payload: {
    //       username: selectedUser.username,
    //       message: data.sendMessage,
    //     },
    //   }),
  });

  useEffect(() => {
    if (selectedUser && !selectedUser.messages) {
      getMessages({ variables: { from: selectedUser.username } });
    }
  }, [selectedUser, getMessages]);

  useEffect(() => {
    if (dataMessages) {
      dispatch({
        type: "SET_USER_MESSAGES",
        payload: {
          username: selectedUser.username,
          messages: dataMessages.getMessages,
        },
      });
    }
  }, [dataMessages]);

  const handleMessage = (e) => {
    e.preventDefault();
    if (content === "" || !selectedUser) return;
    sendMessage({ variables: { to: selectedUser.username, content } });
    setContent("");
  };

  return (
    <div className="bg-message">
      <div className="content-message">
        {!messages && !loadingMessages ? (
          <p className="info-message">Select a friend</p>
        ) : loadingMessages ? (
          <p className="info-message">Loading...</p>
        ) : messages.length > 0 ? (
          messages.map((m, i) => (
            <>
              <Message key={m.uuid} message={m} />
              {i === messages.length - 1 && (
                <div style={{ marginBottom: "-20px" }}>
                  <br />
                </div>
              )}
            </>
          ))
        ) : messages.length === 0 ? (
          <p className="info-message">
            You are now connected send your first message
          </p>
        ) : (
          "You dont have message"
        )}
      </div>
      <form onSubmit={handleMessage} className="form-input-message">
        <input
          type="text"
          className="input-message"
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <SendIcon onClick={handleMessage} role="button" />
      </form>
    </div>
  );
};

export default Messages;
