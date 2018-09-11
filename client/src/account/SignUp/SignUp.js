import React, { Component } from "react";
import { Form, Icon, Input, Button } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components";

const FormWrapper = styled.div`
  max-width: 320px;
  margin: 60px auto 0;
`;

class SignUp extends Component {
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
          .then(res => res.json())
          .catch(error => console.error("Error:", error))
          .then(response => console.log("Success:", response));
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
            {getFieldDecorator("firstName", {
              rules: [
                { required: true, message: "Please input your first name" }
              ]
            })(
              <Input prefix={<Icon type="user" />} placeholder="First name" />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("lastName", {
              rules: [
                { required: true, message: "Please input your last name" }
              ]
            })(<Input prefix={<Icon type="user" />} placeholder="Last name" />)}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("username", {
              rules: [{ required: true, message: "Please input your username" }]
            })(<Input prefix={<Icon type="user" />} placeholder="Username" />)}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("password", {
              rules: [{ required: true, message: "Please input your password" }]
            })(
              <Input
                prefix={<Icon type="lock" />}
                type="password"
                placeholder="Password"
              />
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
            Or <Link to="/login">Log In</Link>
          </Form.Item>
        </Form>
      </FormWrapper>
    );
  }
}

export default Form.create()(SignUp);
