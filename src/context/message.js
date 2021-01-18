import { createContext, useContext, useReducer } from "react";

const MessageStateContext = createContext();
const MessageDispatchContext = createContext();

const messageReducer = (state, action) => {
  let usersSelected;
  let userIndex;
  const { username, message, messages, reaction } = action.payload;
  switch (action.type) {
    case "SET_USERS":
      return {
        ...state,
        users: action.payload,
      };
    case "SET_USER_MESSAGES":
      usersSelected = [...state.users];
      userIndex = usersSelected.findIndex((u) => u.username === username);
      usersSelected[userIndex] = { ...usersSelected[userIndex], messages };
      return {
        ...state,
        users: usersSelected,
      };
    case "SET_SELECTED_USER":
      usersSelected = state.users.map((user) => ({
        ...user,
        selected: user.username === action.payload,
      }));
      return {
        ...state,
        users: usersSelected,
      };
    case "ADD_MESSAGE":
      usersSelected = [...state.users];
      userIndex = usersSelected.findIndex((u) => u.username === username);
      message.reactions = [];
      let newUser = {
        ...usersSelected[userIndex],
        messages: usersSelected[userIndex].messages
          ? [message, ...usersSelected[userIndex].messages]
          : null,
        latestMessage: message,
      };
      usersSelected[userIndex] = newUser;
      return {
        ...state,
        users: usersSelected,
      };
    case "ADD_REACTION":
      usersSelected = [...state.users];
      userIndex = usersSelected.findIndex((u) => u.username === username);
      // make a shallow copy of user
      let userSelected = { ...usersSelected[userIndex] };
      //  find the index of the message that this reaction pertains to
      const messageIndex = userSelected.messages?.findIndex(
        (m) => m.uuid === reaction.message.uuid
      );
      if (messageIndex > -1) {
        // make a shallow copy of user messages
        let messagesSelected = [...userSelected.messages];
        // make a shallow copy of user message reaction
        let reactionsSelected = [...messagesSelected[messageIndex].reactions];

        const reactionIndex = reactionsSelected?.findIndex(
          (r) => r.uuid === reaction.uuid
        );
        if (reactionIndex > -1) {
          // reaction exists update id
          reactionsSelected[reactionIndex] = reaction;
        } else {
          // new Reaction add it
          reactionsSelected = [...reactionsSelected, reaction];
        }
        messagesSelected[messageIndex] = {
          ...messagesSelected[messageIndex],
          reactions: reactionsSelected,
        };
        userSelected = { ...userSelected, messages: messagesSelected };
        usersSelected[userIndex] = userSelected;
      }
      return {
        ...state,
        users: usersSelected,
      };
    default:
      return state;
  }
};

export const MessageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(messageReducer, { users: null });
  return (
    <MessageDispatchContext.Provider value={dispatch}>
      <MessageStateContext.Provider value={state}>
        {children}
      </MessageStateContext.Provider>
    </MessageDispatchContext.Provider>
  );
};

export const useMessageState = () => useContext(MessageStateContext);
export const useMessageDispatch = () => useContext(MessageDispatchContext);
