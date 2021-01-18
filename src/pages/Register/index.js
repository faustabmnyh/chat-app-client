import { useState } from "react";
import {
  Button,
  Container,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  makeStyles,
} from "@material-ui/core";
import { REGISTER_USER } from "../../graphql/mutation/users";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { useMutation } from "@apollo/client";
import Alert from "@material-ui/lab/Alert";
import { Link } from "react-router-dom";
import { useAuthDispatch } from "../../context/auth";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "98%",
    },
    marginTop: "20px",
  },
  container: {
    background: "white",
    padding: "2rem",
    marginTop: "2rem",
    borderRadius: "20px",
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
  },
  error: {
    width: "98%",
  },
}));

const Register = () => {
  const classes = useStyles();
  const dispatch = useAuthDispatch();
  const [variables, setVariables] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    showPassword: false,
    showConfirmPassword: false,
  });
  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register } }) {
      dispatch({
        type: "LOGIN",
        payload: register,
      });
      window.location.href = "/";
    },
    onError: (err) =>
      setErrors(err.graphQLErrors[0].extensions.exception.errors),
  });

  const handleChange = (prop) => (event) => {
    setVariables({ ...variables, [prop]: event.target.value });
  };
  const handleClickShowPassword = (prop) => {
    setValues({
      ...values,
      [prop]:
        prop === "showPassword"
          ? !values.showPassword
          : !values.showConfirmPassword,
    });
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser({ variables });
  };
  return (
    <Container className={classes.container} maxWidth="sm">
      <h1>Register</h1>
      <form className={classes.root} autoComplete="off" onSubmit={handleSubmit}>
        <InputLabel htmlFor="standard-adornment-password">Username</InputLabel>
        <Input
          variant="outlined"
          label="Username"
          type="text"
          value={variables.username}
          onChange={handleChange("username")}
        />
        <div className={classes.error}>
          {errors && errors.username && (
            <Alert severity="error">{errors.username}</Alert>
          )}
        </div>
        <InputLabel htmlFor="standard-adornment-password">Email</InputLabel>
        <Input
          variant="outlined"
          label="Email"
          type="email"
          value={variables.email}
          onChange={handleChange("email")}
        />
        <div className={classes.error}>
          {errors && errors.email && (
            <Alert severity="error">{errors.email}</Alert>
          )}
        </div>

        <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
        <Input
          variant="outlined"
          label="Password"
          type={values.showPassword ? "text" : "password"}
          value={variables.password}
          onChange={handleChange("password")}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => handleClickShowPassword("showPassword")}
                onMouseDown={handleMouseDownPassword}
              >
                {values.showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
        <div className={classes.error}>
          {errors && errors.password && (
            <Alert severity="error">{errors.password}</Alert>
          )}
        </div>
        <InputLabel htmlFor="standard-adornment-password">
          Confirm Password
        </InputLabel>
        <Input
          variant="outlined"
          label="Confirm Password"
          type={values.showConfirmPassword ? "text" : "password"}
          value={variables.confirmPassword}
          onChange={handleChange("confirmPassword")}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => handleClickShowPassword("showConfirmPassword")}
                onMouseDown={handleMouseDownPassword}
              >
                {values.showConfirmPassword ? (
                  <Visibility />
                ) : (
                  <VisibilityOff />
                )}
              </IconButton>
            </InputAdornment>
          }
        />
        <div className={classes.error}>
          {errors && errors.confirmPassword && (
            <Alert severity="error">{errors.confirmPassword}</Alert>
          )}
        </div>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? "Loading..." : "Register"}
        </Button>
        <small>
          Already have an account ? <Link to="/login">Login</Link>
        </small>
      </form>
    </Container>
  );
};

export default Register;
