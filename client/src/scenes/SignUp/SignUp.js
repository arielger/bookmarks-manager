import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Icon, Input, Button, message } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components/macro";
import { users as usersApi } from "../../api";

const FormWrapper = styled.div`
  max-width: 320px;
  margin: 60px auto 0;
`;

const LinksContainer = styled.div`
  margin-top: 16px;
  text-align: center;
`;

class SignUp extends Component {
  static propTypes = {
    setUserToken: PropTypes.func.isRequired
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        usersApi
          .signup(values)
          .then(({ token }) => {
            this.props.setUserToken(token);
          })
          // @todo: Refactor axios error handling
          .catch(error => {
            if (error.response) {
              const errorData = error.response.data.error;
              this.props.form.setFields({
                email: {
                  value: this.props.form.getFieldValue("email"),
                  errors: errorData.details.email && [
                    new Error(errorData.details.email.message)
                  ]
                },
                password: {
                  value: "",
                  errors: errorData.details.password && [
                    new Error(errorData.details.password.message)
                  ]
                }
              });
            } else {
              message.error(
                "There was an error trying to create your account."
              );
            }
          });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <FormWrapper>
        <h1>Sign up</h1>
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
              rules: [
                { required: true, message: "Please input your password" },
                {
                  min: 6,
                  message: "The password should have at least 6 characters"
                },
                {
                  max: 128,
                  message:
                    "The password should not have more than 128 characters"
                }
              ]
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
              Register
            </Button>
            <LinksContainer>
              <Link to="/login">Log In ›</Link>
            </LinksContainer>
          </Form.Item>
        </Form>
      </FormWrapper>
    );
  }
}

export default Form.create()(SignUp);
