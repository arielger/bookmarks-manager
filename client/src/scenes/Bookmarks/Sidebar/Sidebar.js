import React from "react";
import { Button, Icon, Form, Input } from "antd";
import { Link as ReactRouterLink } from "react-router-dom";
import styled from "styled-components";

const Sidebar = styled.div`
  width: 300px;
  background-color: white;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .button {
    margin-bottom: 12px;
  }
`;

const Title = styled.h1`
  text-align: center;
  font-size: 48px;
`;

const Link = styled(ReactRouterLink)`
  display: block;
`;

const CreateFolderBtn = ({ createFolder }) => {
  const [isActive, setIsActive] = React.useState(false);
  const [folderTitle, setFolderTitle] = React.useState("");

  return isActive ? (
    <Input
      value={folderTitle}
      onChange={e => setFolderTitle(e.target.value)}
      onPressEnter={e => {
        createFolder({ title: e.target.value });
      }}
      onBlur={() => setIsActive(false)}
    />
  ) : (
    <Button
      className="button"
      onClick={() => setIsActive(true)}
      icon="folder-add"
      size="large"
      block={true}
    >
      Create folder
    </Button>
  );
};

export default ({ createFolder, folders, logout, showAddBookmark }) => {
  return (
    <Sidebar>
      <Title>📌</Title>
      <div>
        <Link to="/">
          <Icon type="pushpin" />
          All bookmarks
        </Link>
        {folders.map(folder => (
          <Link to={`/folders/${folder.id}`}>
            <Icon type="folder" />
            {folder.title}
          </Link>
        ))}
        <CreateFolderBtn createFolder={createFolder} />
      </div>
      <div>
        <Button
          type="primary"
          icon="plus"
          size="large"
          block={true}
          className="button"
          onClick={showAddBookmark}
        >
          Add bookmark
        </Button>
        <Button
          type="default"
          icon="logout"
          size="large"
          block={true}
          onClick={logout}
        >
          Log out
        </Button>
      </div>
    </Sidebar>
  );
};
