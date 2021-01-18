import { createContext, useContext, useReducer } from "react";
import jwtDecode from "jwt-decode";

const AuthStateContext = createContext();
const AuthDipsatchContext = createContext();

let user;
const token = localStorage.getItem("userToken");
if (token) {
  const decodedToken = jwtDecode(token);
  const expiresAt = new Date(decodedToken.exp * 1000);
  if (new Date() > expiresAt) {
    localStorage.removeItem("userToken");
  } else {
    user = decodedToken;
  }
}

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("userToken", action.payload.token);
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      localStorage.removeItem("userToken");
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user });
  return (
    <AuthDipsatchContext.Provider value={dispatch}>
      <AuthStateContext.Provider value={state}>
        {children}
      </AuthStateContext.Provider>
    </AuthDipsatchContext.Provider>
  );
};

export const useAuthState = () => useContext(AuthStateContext);
export const useAuthDispatch = () => useContext(AuthDipsatchContext);
