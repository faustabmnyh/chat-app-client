import { useQuery } from "@apollo/client";
import { Avatar, Box } from "@material-ui/core";
import React, { useState } from "react";
import { useMessageDispatch, useMessageState } from "../context/message";
import { GET_USERS } from "../graphql/query/users";

const Users = () => {
  const dispatch = useMessageDispatch();
  const { users } = useMessageState();
  const selectedUser = users?.find((u) => u.selected);
  const [error, setError] = useState("");
  const { loading } = useQuery(GET_USERS, {
    onCompleted(data) {
      dispatch({
        type: "SET_USERS",
        payload: data.getUsers,
      });
    },
    onError(err) {
      setError(err);
    },
  });

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  return (
    <div>
      {loading || !users ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : users.length === 0 ? (
        <p>No User</p>
      ) : (
        users.map((user) => (
          <div
            key={user.username}
            onClick={() =>
              dispatch({ type: "SET_SELECTED_USER", payload: user.username })
            }
            role="button"
            className={
              selectedUser?.username === user.username
                ? "user-text active"
                : "user-text"
            }
          >
            <Box display="flex" alignItems="center" padding="0.5rem">
              <Avatar src={user.imageURL} />
              <Box display="flex" flexDirection="column" marginLeft="10px">
                <p>{user.username}</p>
                <p className="text-content">
                  {user.latestMessage
                    ? truncate(user.latestMessage.content, 35)
                    : "You are new connected"}
                </p>
              </Box>
            </Box>
          </div>
        ))
      )}
    </div>
  );
};

export default Users;
