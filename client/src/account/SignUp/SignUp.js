import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Icon, Input, Button, Alert } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components";

const FormWrapper = styled.div`
  max-width: 320px;
  margin: 60px auto 0;
`;

// @todo: Review handle errors logic
// @todo: Add api file
function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

class SignUp extends Component {
  static propTypes = {
    setUserToken: PropTypes.func.isRequired
  };

  state = {
    error: "",
    redirectToHomepage: false
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Sign up with values:", values);

        fetch("/users/signup", {
          method: "POST",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(handleErrors)
          .then(res => res.json())
          .then(res => {
            this.props.setUserToken(res.token);
          })
          .catch(error => {
            console.error("Error:", error);
            this.setState({ error });
          });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { error } = this.state;

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
          {error && <Alert message={error} type="error" />}
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              Register
            </Button>
            <br />
            <p>
              Or <Link to="/login">Log In</Link>
            </p>
          </Form.Item>
        </Form>
      </FormWrapper>
    );
  }
}

export default Form.create()(SignUp);
