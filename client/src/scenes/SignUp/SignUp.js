import React from "react";
import { connect } from "react-redux";
import { Form, Icon, Input, Button } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components/macro";
import { GoogleLogin } from "react-google-login";

import { signUp } from "../../store/user";

const FormWrapper = styled.div`
  max-width: 320px;
  margin: 60px auto 0;
`;

const LinksContainer = styled.div`
  margin-top: 16px;
  text-align: center;
`;

const SignUp = connect(
  ({ user }) => ({ isLoading: user.isLoading }),
  { signUp }
)(({ form, signUp, isLoading }) => {
  const { getFieldDecorator } = form;

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
      <h1>Sign up</h1>
      {/* <GoogleLogin
        clientId="715918354633-f88ortu45c1cmcl64hb1i2mqdqons0bk.apps.googleusercontent.com"
        buttonText="Sign up with Google"
        onSuccess={response => {
          console.log("s", response);

          axios
            .post("http://localhost:5000/auth/google", {
              access_token: response.accessToken
            })
            .then(response => {
              console.log("response", response);
            });
        }}
        onFailure={e => {
          console.log("e", e);
        }}
      /> */}
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
        <Form.Item>
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
              type="password"
              placeholder="Password"
              size="large"
              autoComplete="new-password"
            />
          )}
        </Form.Item>
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
            <Link to="/login">Log In ›</Link>
          </LinksContainer>
        </Form.Item>
      </Form>
    </FormWrapper>
  );
});

export default Form.create()(SignUp);
