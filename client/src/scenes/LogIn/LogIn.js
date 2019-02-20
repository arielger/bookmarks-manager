import React from "react";
import { connect } from "react-redux";
import { Form, Icon, Input, Button, Checkbox } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components/macro";

import { logIn } from "../../store/user";

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

const LinksContainer = styled.div`
  margin-top: 16px;
  text-align: center;
`;

const LogIn = connect(
  ({ user }) => ({ isLoading: user.isLoading }),
  { logIn }
)(({ form, isLoading, logIn }) => {
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
      <h1>Log in</h1>
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
            <Link to="/signup">Sign up ›</Link>
          </LinksContainer>
        </Form.Item>
      </Form>
    </FormWrapper>
  );
});

export default Form.create()(LogIn);
