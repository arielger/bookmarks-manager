import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Icon, Input, Button } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { users as usersApi } from "../../api";

const FormWrapper = styled.div`
  max-width: 320px;
  margin: 60px auto 0;
`;

class LogIn extends Component {
  static propTypes = {
    setUserToken: PropTypes.func.isRequired
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        usersApi
          .login(values)
          .then(({ data: { token } }) => {
            this.props.setUserToken(token);
          })
          .catch(error => console.error("Error:", error));
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <FormWrapper>
        <h1>Log in</h1>
        <Form onSubmit={this.handleSubmit} layout="vertical">
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
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("password", {
              rules: [{ required: true, message: "Please input your password" }]
            })(
              <Input
                prefix={<Icon type="lock" />}
                type="password"
                placeholder="Password"
                size="large"
              />
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              Log In
            </Button>
            <p>
              Or <Link to="/signup">Sign up</Link>
            </p>
          </Form.Item>
        </Form>
      </FormWrapper>
    );
  }
}

export default Form.create()(LogIn);
