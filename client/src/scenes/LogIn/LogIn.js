import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Icon, Input, Button, Checkbox, message } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components/macro";
import { users as usersApi } from "../../api";

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

class LogIn extends Component {
  state = {
    isLoading: false,
    showPassword: false
  };

  static propTypes = {
    setUserToken: PropTypes.func.isRequired
  };

  handleSubmit = e => {
    const { form } = this.props;
    e.preventDefault();

    form.validateFields((err, values) => {
      if (!err) {
        this.setState({ isLoading: true });
        usersApi
          .login(values)
          .then(({ token }) => {
            this.props.setUserToken(token);
            this.setState({ isLoading: false });
          })
          .catch(error => {
            message.error(
              "Unable to login. Please check your email and password and try again."
            );
            form.setFieldsValue({
              password: ""
            });
            this.setState({ isLoading: false });
          });
      }
    });
  };

  toggleShowPassword = () => {
    this.setState(prevState => ({
      showPassword: !prevState.showPassword
    }));
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { isLoading, showPassword } = this.state;

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
          <Form.Item className="password-container">
            {getFieldDecorator("password", {
              rules: [{ required: true, message: "Please input your password" }]
            })(
              <Input
                prefix={<Icon type="lock" />}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                size="large"
              />
            )}
          </Form.Item>
          <Checkbox
            className="show-password"
            onChange={this.toggleShowPassword}
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
  }
}

export default Form.create()(LogIn);
