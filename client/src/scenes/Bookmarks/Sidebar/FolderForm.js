import React from "react";
import { Form, Button, Input, Modal } from "antd";

const useCloseModalAfterLoading = (isLoading, closeModal) => {
  // Prevent closing modal in first render
  const isFirstRender = React.useRef(true);

  React.useEffect(
    () => {
      if (!isLoading && !isFirstRender.current) {
        closeModal();
      }
      isFirstRender.current = false;
    },
    [isLoading]
  );
};

const FolderForm = ({
  handleDelete,
  handleUpdate,
  folder,
  isLoadingEdit,
  isLoadingDelete,
  visible,
  closeModal,
  form
}) => {
  const { getFieldDecorator } = form;

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFields((err, folderData) => {
      if (!err) {
        handleUpdate(folderData);
      }
    });
  };

  useCloseModalAfterLoading(isLoadingEdit, closeModal);
  useCloseModalAfterLoading(isLoadingDelete, closeModal);

  return (
    <Modal
      title="Edit folder"
      visible={visible}
      width={400}
      destroyOnClose={true}
      footer={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            key="delete"
            type="danger"
            loading={isLoadingDelete}
            disabled={isLoadingEdit}
            onClick={handleDelete}
          >
            Delete
          </Button>
          <div>
            <Button
              key="back"
              disabled={isLoadingDelete || isLoadingEdit}
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              key="submit"
              type="primary"
              loading={isLoadingEdit}
              disabled={isLoadingDelete}
              onClick={handleSubmit}
            >
              Save
            </Button>
          </div>
        </div>
      }
    >
      <Form onSubmit={handleSubmit} layout="vertical" hideRequiredMark={true}>
        <Form.Item label="Title">
          {getFieldDecorator("title", {
            required: true,
            message: "Please input a title",
            initialValue: folder.title
          })(<Input type="text" placeholder="Title" />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create()(FolderForm);
