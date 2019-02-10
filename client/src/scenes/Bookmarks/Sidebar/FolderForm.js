import React from "react";
import styled from "styled-components";
import { Form, Button, Input, Modal, Icon } from "antd";
import emojis from "emoji-mart/data/apple.json";
import "emoji-mart/css/emoji-mart.css";
import NimblePicker from "emoji-mart/dist-es/components/picker/nimble-picker";
import useOnClickOutside from "use-onclickoutside";

const EmojiWrapper = styled.div`
  width: 80px;
  height: 80px;
  background-color: #f1f3f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  position: relative;
  font-size: 40px;

  .change-icon-btn {
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    bottom: 0;
    right: 0;
    background-color: #343a40;
    color: white;
    padding: 0;
    border: none;
    font-size: 12px;
    cursor: pointer;

    &:hover,
    &:focus {
      outline: none;
      background-color: #212529;
    }
  }

  .emoji-mart {
    position: absolute;
    z-index: 1;
    left: calc(100% + 16px);
    top: calc(100% - 24px);
  }
`;

const IconPickerInner = ({ value, onChange }) => {
  const [isPickerVisible, setPickerVisible] = React.useState(false);

  const showPicker = () => setPickerVisible(true);
  const closePicker = () => setPickerVisible(false);

  const emojiPickerRef = React.useRef();
  useOnClickOutside(emojiPickerRef, closePicker);

  return (
    <EmojiWrapper>
      {value ? <span>{value}</span> : <Icon type="folder" />}
      <button className="change-icon-btn" onClick={showPicker} type="button">
        <Icon type="edit" />
      </button>
      {isPickerVisible && (
        <div ref={emojiPickerRef}>
          <NimblePicker
            set="apple"
            data={emojis}
            title=""
            onSelect={emoji => onChange(emoji.native)}
            showPreview={false}
          />
        </div>
      )}
    </EmojiWrapper>
  );
};

// Antd requires third-party form controls to be a class component
// https://ant.design/components/form/#components-form-demo-customized-form-controls
class IconPicker extends React.Component {
  render() {
    return <IconPickerInner {...this.props} />;
  }
}

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
      onCancel={closeModal}
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
        <Form.Item>
          {getFieldDecorator("icon", {
            initialValue: folder.icon
          })(<IconPicker />)}
        </Form.Item>
        <Form.Item label="Title">
          {getFieldDecorator("title", {
            rules: [
              {
                required: true,
                message: "Please enter a title"
              }
            ],
            initialValue: folder.title
          })(<Input type="text" placeholder="Title" />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create()(FolderForm);
