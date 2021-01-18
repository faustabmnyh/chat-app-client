import ApolloProvider from "./ApolloProvider";
import { BrowserRouter as Router } from "react-router-dom";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { AuthProvider } from "./context/auth";
import PrivateRoute from "./utils/PrivateRoute";
import { MessageProvider } from "./context/message";

function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
        <MessageProvider>
          <Router>
            <PrivateRoute exact path="/" component={Home} authenticated />
            <PrivateRoute exact path="/register" component={Register} guest />
            <PrivateRoute exact path="/login" component={Login} guest />
          </Router>
        </MessageProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
