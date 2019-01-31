import React from "react";
import { Icon, Form, Input } from "antd";
import styled from "styled-components/macro";
import { useKeyPress } from "../../../hooks";

const Wrapper = styled.button`
  background-color: transparent;
  width: 100%;
  border: none;
  padding: 10px 30px;
  text-align: left;
  font-size: 16px;
  display: flex;
  align-items: center;
  height: 44px;

  &:hover,
  &:focus {
    background-color: rgba(0, 0, 0, 0.1);
    text-decoration: none;
  }

  .anticon {
    margin-right: 12px;
  }
`;

const CreateFolderButton = ({ createFolder }) => {
  const [isActive, setIsActive] = React.useState(false);
  const [folderTitle, setFolderTitle] = React.useState("");

  const keyDownHandler = ({ key }) => {
    if (key === "Escape") {
      deactivateInput();
    }
  };

  const activateInput = () => {
    setIsActive(true);
    window.addEventListener("keydown", keyDownHandler);
  };

  const deactivateInput = () => {
    setIsActive(false);
    window.removeEventListener("keydown", keyDownHandler);
  };

  return (
    <div style={{ marginBottom: 10 }}>
      {isActive ? (
        <Wrapper as="div">
          <Icon type="folder-add" theme="filled" />
          <Input
            value={folderTitle}
            onChange={e => setFolderTitle(e.target.value)}
            onPressEnter={e => {
              createFolder({ title: e.target.value });
              setFolderTitle("");
            }}
            onBlur={deactivateInput}
            autoFocus={true}
          />
        </Wrapper>
      ) : (
        <Wrapper as="button" onClick={activateInput}>
          <Icon type="folder-add" />
          Create folder
        </Wrapper>
      )}
    </div>
  );
};

export default CreateFolderButton;
