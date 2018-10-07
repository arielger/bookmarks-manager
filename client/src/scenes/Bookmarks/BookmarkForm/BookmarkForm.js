import React, { Component } from "react";
import { Form, Icon, Input, Modal } from "antd";
import { bookmarks as bookmarksApi } from "../../../api";

export class NewBookmark extends Component {
  state = {
    confirmLoading: false
  };

  handleSubmit = e => {
    e.preventDefault();

    this.setState({ confirmLoading: true });
    this.props.form.validateFields((err, values) => {
      if (!err) {
        bookmarksApi
          .create(values)
          .then(({ data }) => {
            this.props.closeModal();
            console.log("📌 Created bookmark", data);
          })
          .catch(error => {
            console.error("Error:", error);
          })
          .finally(() => {
            this.setState({ confirmLoading: false });
          });
      }
    });
  };

  render() {
    const {
      visible,
      closeModal,
      form: { getFieldDecorator }
    } = this.props;
    const { confirmLoading } = this.state;

    return (
      <Modal
        title="New bookmark"
        visible={visible}
        onOk={this.handleSubmit}
        onCancel={closeModal}
        okText="Add"
        width={400}
        confirmLoading={confirmLoading}
        destroyOnClose={true}
      >
        <Form
          onSubmit={this.handleSubmit}
          layout="vertical"
          hideRequiredMark={true}
        >
          <Form.Item label="URL">
            {getFieldDecorator("url", {
              rules: [
                {
                  required: true,
                  message: "Please input an URL"
                }
              ]
            })(
              <Input
                type="text"
                placeholder="URL"
                prefix={<Icon type="link" />}
              />
            )}
          </Form.Item>
          <Form.Item label="Title">
            {getFieldDecorator("title", {
              required: true,
              message: "Please input a title"
            })(<Input type="text" placeholder="Title" />)}
          </Form.Item>
          <Form.Item label="Description">
            {getFieldDecorator("description")(
              <Input.TextArea placeholder="Description" />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(NewBookmark);
