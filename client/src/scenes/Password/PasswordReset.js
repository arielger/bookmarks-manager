import React from "react";
import * as R from "ramda";
import qs from "qs";
import { connect } from "react-redux";
import { Form, Icon, Input, Button, Checkbox } from "antd";
import styled from "styled-components/macro";

import { resetPassword } from "../../store/user";

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

const PasswordReset = connect(
  undefined,
  { resetPassword }
)(({ form, isLoading, resetPassword, location }) => {
  const { getFieldDecorator } = form;

  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = e => {
    e.preventDefault();

    form.validateFields((err, values) => {
      if (!err) {
        resetPassword(
          values.password,
          R.prop(
            "token",
            qs.parse(location.search, { ignoreQueryPrefix: true })
          )
        );
      }
    });
  };

  return (
    <FormWrapper>
      <Title>Forgot your password?</Title>
      <Form onSubmit={handleSubmit} layout="vertical">
        <p>Enter your new password</p>
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
            Reset password
          </Button>
        </Form.Item>
      </Form>
    </FormWrapper>
  );
});

export default Form.create()(PasswordReset);
