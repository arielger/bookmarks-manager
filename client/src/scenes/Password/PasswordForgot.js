import React from "react";
import { connect } from "react-redux";
import { Form, Icon, Input, Button } from "antd";
import styled from "styled-components/macro";

import { forgotPassword } from "../../store/user";

const Title = styled.h1`
  text-align: center;
  margin-bottom: 32px;
`;

const FormWrapper = styled.div`
  max-width: 320px;
  margin: 60px auto 0;
`;

const PasswordForgot = connect(
  undefined,
  { forgotPassword }
)(({ form, isLoading, forgotPassword }) => {
  const { getFieldDecorator } = form;

  const handleSubmit = e => {
    e.preventDefault();

    form.validateFields((err, values) => {
      if (!err) {
        forgotPassword(values.email);
      }
    });
  };

  return (
    <FormWrapper>
      <Title>Forgot your password?</Title>
      <Form onSubmit={handleSubmit} layout="vertical">
        <p>
          Enter the email address you registered with and we'll send you
          instructions on how to reset it.
        </p>
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
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={isLoading}
            block
          >
            Send reset instructions
          </Button>
        </Form.Item>
      </Form>
    </FormWrapper>
  );
});

export default Form.create()(PasswordForgot);
