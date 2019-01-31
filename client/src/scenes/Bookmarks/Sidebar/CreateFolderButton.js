import React from "react";
import { Icon, Form, Input } from "antd";
import styled from "styled-components/macro";

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

  return (
    <div style={{ marginBottom: 10 }}>
      {isActive ? (
        <Wrapper as="div">
          <Icon type="folder-add" />
          <Input
            value={folderTitle}
            onChange={e => setFolderTitle(e.target.value)}
            onPressEnter={e => {
              createFolder({ title: e.target.value });
            }}
            onBlur={() => setIsActive(false)}
          />
        </Wrapper>
      ) : (
        <Wrapper as="button" onClick={() => setIsActive(true)}>
          <Icon type="folder-add" />
          Create folder
        </Wrapper>
      )}
    </div>
  );
};

export default CreateFolderButton;
