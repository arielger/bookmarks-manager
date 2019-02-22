import React from "react";
import { connect } from "react-redux";
import { Form, Icon, Input, Button, Checkbox } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components/macro";
import { GoogleLogin } from "react-google-login";

import { logIn, logInWithProvider } from "../../store/user";

const Title = styled.h1`
  text-align: center;
  margin-bottom: 32px;
`;

const FormWrapper = styled.div`
  max-width: 320px;
  margin: 60px auto 0;

  .password-container {
    margin-bottom: 4px;
  }

  .show-password {
    margin-bottom: 24px;
  }
`;

const SocialProviders = styled.div`
  padding-bottom: 24px;
  border-bottom: 1px solid #f1f3f5;
  margin-bottom: 24px;

  .google-btn {
    width: 100%;

    svg {
      display: block;
    }
  }
`;

const LinksContainer = styled.div`
  margin-top: 24px;
  text-align: center;
`;

const LogIn = connect(
  ({ user }) => ({ isLoading: user.isLoading }),
  { logIn, logInWithProvider }
)(({ form, isLoading, logIn, logInWithProvider }) => {
  const { getFieldDecorator } = form;
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = e => {
    e.preventDefault();

    form.validateFields((err, values) => {
      if (!err) {
        logIn(values, form);
      }
    });
  };

  return (
    <FormWrapper>
      <Title>Log in</Title>
      <SocialProviders>
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENTID}
          buttonText="Log in with Google"
          className="google-btn"
          onSuccess={response => {
            logInWithProvider("google", response.accessToken, false);
          }}
          onFailure={e => {
            console.log("Error logging in with Google: ", e);
          }}
        />
      </SocialProviders>
      <Form onSubmit={handleSubmit} layout="vertical">
        <Form.Item>
          {getFieldDecorator("email", {
            rules: [
              {
                type: "email",
                message: "The input is not a valid email!"
              },
              {
                required: true,
                message: "Please input your email"
              }
            ]
          })(
            <Input
              prefix={<Icon type="mail" />}
              placeholder="Email"
              size="large"
              autoComplete="username"
            />
          )}
        </Form.Item>
        <Form.Item className="password-container">
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "Please input your password" }]
          })(
            <Input
              prefix={<Icon type="lock" />}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              size="large"
              autoComplete="current-password"
            />
          )}
        </Form.Item>
        <Checkbox
          className="show-password"
          onChange={() => setShowPassword(!showPassword)}
        >
          Show password
        </Checkbox>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={isLoading}
            block
          >
            Log In
          </Button>
          <LinksContainer>
            <div style={{ marginBottom: 10 }}>
              Don't have an account? <Link to="/signup">Sign up ›</Link>
            </div>
            <Link to="/password/forgot">Forgot your password?</Link>
          </LinksContainer>
        </Form.Item>
      </Form>
    </FormWrapper>
  );
});

export default Form.create()(LogIn);
