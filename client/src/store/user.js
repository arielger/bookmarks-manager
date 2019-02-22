import * as R from "ramda";
import { createSlice } from "redux-starter-kit";
import { handle } from "redux-pack";
import { users as usersApi } from "../api";
import { message as antdMessage } from "antd";

const signUp = (values, form) => ({
  type: "signUp",
  promise: usersApi.signup(values),
  meta: {
    onSuccess: ({ token }) => {
      sessionStorage.setItem("jwtToken", token);
    },
    // Handle form errors without storing them in redux store
    onFailure: error => {
      const details = R.propOr({}, "details", error);

      if (!details) {
        antdMessage.error("There was an error trying to create your account.");
      } else {
        form.setFields({
          email: {
            value: form.getFieldValue("email"),
            errors: details.email && [new Error(details.email.message)]
          },
          password: {
            value: "",
            errors: details.password && [new Error(details.password.message)]
          }
        });
      }
    }
  }
});

const logIn = (values, form) => ({
  type: "logIn",
  promise: usersApi.login(values),
  meta: {
    onSuccess: ({ token }) => {
      sessionStorage.setItem("jwtToken", token);
    },
    onFailure: response => {
      antdMessage.error(
        "Unable to login. Please check your email and password and try again."
      );
      form.setFieldsValue({
        password: ""
      });
    }
  }
});

const logInWithProvider = (provider, accessToken, isSignUp) => ({
  type: "logInWithProvider",
  promise: usersApi.logInWithProvider(provider, accessToken, isSignUp),
  meta: {
    onSuccess: ({ token, message }) => {
      sessionStorage.setItem("jwtToken", token);

      if (message) {
        antdMessage.success(message, 5);
      }
    },
    onFailure: () => {
      antdMessage.error(
        `There was an error trying to log in with ${provider}.`
      );
    }
  }
});

const forgotPassword = (email, handleSuccess) => ({
  type: "forgotPassword",
  promise: usersApi.forgotPassword(email),
  meta: {
    onSuccess: () => {
      handleSuccess();
    },
    onFailure: () => {
      antdMessage.error(`There was an error sending the reset instructions.`);
    }
  }
});

const resetPassword = (newPassword, token) => ({
  type: "resetPassword",
  promise: usersApi.resetPassword(newPassword, token),
  meta: {
    onFailure: () => {
      antdMessage.error(`There was an error trying to reset your password.`);
    }
  }
});

const userSlice = createSlice({
  slice: "user",
  initialState: {
    isLoading: false,
    isAuthenticated: false,
    token: sessionStorage.getItem("jwtToken") || ""
  },
  reducers: {
    logout(state) {
      sessionStorage.removeItem("jwtToken");
      return R.pipe(
        R.dissoc("token"),
        R.assoc("isAuthenticated", false)
      )(state);
    }
  },
  extraReducers: {
    // @todo: Refactor signUp, logIn and logInWithProvider to share same logic
    signUp(state, action) {
      return handle(state, action, {
        start: R.assoc("isLoading", true),
        success: prevState =>
          R.pipe(
            R.assoc("token", action.payload.token),
            R.assoc("isAuthenticated", true)
          )(prevState),
        finish: R.assoc("isLoading", false)
      });
    },
    logIn(state, action) {
      return handle(state, action, {
        start: R.assoc("isLoading", true),
        success: prevState =>
          R.pipe(
            R.assoc("token", action.payload.token),
            R.assoc("isAuthenticated", true)
          )(prevState),
        finish: R.assoc("isLoading", false)
      });
    },
    logInWithProvider(state, action) {
      return handle(state, action, {
        start: R.assoc("isLoading", true),
        success: prevState =>
          R.pipe(
            R.assoc("token", action.payload.token),
            R.assoc("isAuthenticated", true)
          )(prevState),
        finish: R.assoc("isLoading", false)
      });
    }
  }
});

const { actions, reducer } = userSlice;
const { logout } = actions;
export {
  signUp,
  logIn,
  logInWithProvider,
  forgotPassword,
  resetPassword,
  logout
};
export default reducer;
