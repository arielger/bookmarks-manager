import React from "react";
import { connect } from "react-redux";
import { Form, Icon, Input, Button, Checkbox } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components/macro";
import { GoogleLogin } from "react-google-login";

import { signUp, logInWithProvider } from "../../store/user";

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
  margin-top: 16px;
  text-align: center;
`;

const SignUp = connect(
  ({ user }) => ({ isLoading: user.isLoading }),
  { signUp, logInWithProvider }
)(({ form, signUp, logInWithProvider, isLoading }) => {
  const { getFieldDecorator } = form;
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        signUp(values, form);
      }
    });
  };

  return (
    <FormWrapper>
      <Title>Sign up</Title>
      <SocialProviders>
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENTID}
          buttonText="Sign up with Google"
          className="google-btn"
          onSuccess={response => {
            logInWithProvider("google", response.accessToken, true);
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
              autoComplete="username"
              placeholder="Email"
              size="large"
            />
          )}
        </Form.Item>
        <Form.Item className="password-container">
          {getFieldDecorator("password", {
            rules: [
              { required: true, message: "Please input your password" },
              {
                min: 6,
                message: "The password should have at least 6 characters"
              },
              {
                max: 128,
                message: "The password should not have more than 128 characters"
              }
            ]
          })(
            <Input
              prefix={<Icon type="lock" />}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              size="large"
              autoComplete="new-password"
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
            loading={isLoading}
            type="primary"
            htmlType="submit"
            size="large"
            block
          >
            Register
          </Button>
          <LinksContainer>
            Already have an account? <Link to="/login">Log In ›</Link>
          </LinksContainer>
        </Form.Item>
      </Form>
    </FormWrapper>
  );
});

export default Form.create()(SignUp);
