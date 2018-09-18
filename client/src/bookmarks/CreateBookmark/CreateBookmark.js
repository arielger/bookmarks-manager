import React, { Component } from "react";
import { Form, Icon, Input, Button } from "antd";
import styled from "styled-components";

const FormWrapper = styled.div`
  max-width: 320px;
  margin: 60px auto 0;
`;

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export class CreateBookmark extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Create bookmark with values:", values);

        fetch("/bookmarks", {
          method: "POST",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
            "x-access-token": this.props.userToken
          }
        })
          .then(handleErrors)
          .then(res => res.json())
          .then(res => {
            console.log("res", res);
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

    return (
      <FormWrapper>
        <Form onSubmit={this.handleSubmit} layout="vertical">
          <Form.Item>
            {getFieldDecorator("url", {
              rules: [
                {
                  required: true,
                  message: "Please input an URL"
                },
                {
                  type: "url",
                  message: "Please input a valid URL"
                }
              ]
            })(<Input type="text" placeholder="URL" />)}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("title", {
              required: true,
              message: "Please input a title"
            })(<Input type="text" placeholder="Title" />)}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("description")(
              <Input.TextArea placeholder="Description" />
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              Create bookmark
            </Button>
          </Form.Item>
        </Form>
      </FormWrapper>
    );
  }
}

export default Form.create()(CreateBookmark);
