import React, { Component } from "react";
import { Form, Icon, Input, Button } from "antd";
import styled from "styled-components";
import { bookmarks as bookmarksApi } from "../../api";

const FormWrapper = styled.div`
  max-width: 320px;
  margin: 60px auto 0;
`;

export class CreateBookmark extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        bookmarksApi
          .create(values)
          .then(({ data }) => {
            console.log("📌 Created bookmark", data);
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
