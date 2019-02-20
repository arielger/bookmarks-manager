import * as R from "ramda";
import { createSlice } from "redux-starter-kit";
import { handle } from "redux-pack";
import { users as usersApi } from "../api";
import { message } from "antd";

const signUp = (values, form) => ({
  type: "signUp",
  promise: usersApi.signup(values),
  meta: {
    onSuccess: ({ token }) => {
      sessionStorage.setItem("jwtToken", token);
    },
    // Handle form errors without storing them in redux store
    onFailure: response => {
      if (!R.path(["error", "details"], response)) {
        message.error("There was an error trying to create your account.");
      } else {
        const details = response.error.details;
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
      message.error(
        "Unable to login. Please check your email and password and try again."
      );
      form.setFieldsValue({
        password: ""
      });
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
    }
  }
});

const { actions, reducer } = userSlice;
const { logout } = actions;
export { signUp, logIn, logout };
export default reducer;
