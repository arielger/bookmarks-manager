import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Icon, Input, Modal } from "antd";
import { bookmarks as bookmarksApi } from "../../../api";

export class BookmarkForm extends Component {
  static propTypes = {
    isNew: PropTypes.bool.isRequired,
    bookmarkData: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired
  };

  state = { confirmLoading: false };

  handleSubmit = e => {
    const { handleSubmit, isNew, bookmarkData } = this.props;

    e.preventDefault();
    const apiFn = isNew ? bookmarksApi.create : bookmarksApi.update;

    this.setState({ confirmLoading: true });
    this.props.form.validateFields((err, values) => {
      console.log("values", values);
      if (!err) {
        apiFn(values, !isNew && bookmarkData.id)
          .then(({ data: bookmark }) => {
            console.log("Bookmark", bookmark);
            handleSubmit(bookmark);
            this.props.closeModal();
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
      isNew,
      bookmarkData = {},
      visible,
      closeModal,
      form: { getFieldDecorator }
    } = this.props;
    const { confirmLoading } = this.state;

    return (
      <Modal
        title={isNew ? "Add bookmark" : "Edit bookmark"}
        visible={visible}
        onOk={this.handleSubmit}
        okText={isNew ? "Add" : "Edit"}
        onCancel={closeModal}
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
              initialValue: bookmarkData.url,
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
              message: "Please input a title",
              initialValue: bookmarkData.title
            })(<Input type="text" placeholder="Title" />)}
          </Form.Item>
          <Form.Item label="Description">
            {getFieldDecorator("description", {
              initialValue: bookmarkData.description
            })(<Input.TextArea placeholder="Description" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(BookmarkForm);