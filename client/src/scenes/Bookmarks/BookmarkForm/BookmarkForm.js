import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Icon, Input, Modal } from "antd";
import validator from "validator";
import normalizeUrl from "normalize-url";

const BookmarkForm = ({
  handleSubmit,
  folderId,
  isNew,
  isLoading,
  bookmarkData = {},
  visible,
  closeModal,
  form
}) => {
  const { getFieldDecorator } = form;

  const onSubmit = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        handleSubmit(
          { ...values, url: normalizeUrl(values.url), folderId },
          bookmarkData.id
        );
      }
    });
  };

  React.useEffect(
    () => {
      if (!isLoading) {
        closeModal();
      }
    },
    [isLoading]
  );

  return (
    <Modal
      title={isNew ? "Add bookmark" : "Edit bookmark"}
      visible={visible}
      onOk={onSubmit}
      okText={isNew ? "Add" : "Edit"}
      onCancel={closeModal}
      width={400}
      confirmLoading={isLoading}
      destroyOnClose={true}
    >
      <Form onSubmit={onSubmit} layout="vertical" hideRequiredMark={true}>
        <Form.Item label="URL">
          {getFieldDecorator("url", {
            initialValue: bookmarkData.url,
            rules: [
              {
                required: true,
                message: "Please input an URL"
              },
              {
                validator: (rule, value, callback) => {
                  if (!validator.isURL(value)) {
                    callback("Please enter a valid URL");
                  }

                  callback();
                }
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
};

BookmarkForm.propTypes = {
  isNew: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  bookmarkData: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired
};

export default Form.create()(BookmarkForm);
