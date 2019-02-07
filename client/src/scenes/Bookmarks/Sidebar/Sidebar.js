import React from "react";
import * as R from "ramda";
import { connect } from "react-redux";
import { Button, Icon } from "antd";
import { NavLink as RRNavLink } from "react-router-dom";
import styled from "styled-components/macro";

import CreateFolderButton from "./CreateFolderButton";
import { loadFolders, createFolder } from "../../../store/folders";

const SidebarWrapper = styled.div`
  background-color: #f1f3f5;
  width: 300px;
  min-width: 300px;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 48px;
  margin-bottom: 0;
`;

const FoldersContainer = styled.div`
  padding: 20px 30px;
  flex: 1;
  overflow: auto;
`;

const FolderList = styled.div`
  margin-bottom: 30px;
`;

const BottomContainer = styled.div`
  padding: 20px 30px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  background-color: white;
`;

const Link = styled(RRNavLink)`
  display: block;
  font-size: 16px;
  height: 40px;
  margin: 0 -30px;
  padding: 10px 30px;
  display: flex;
  align-items: center;
  color: #212529;

  &:hover,
  &:focus {
    background-color: rgba(0, 0, 0, 0.1);
    text-decoration: none;
  }

  &.active {
    background-color: #339af0;
    color: #f8f9fa;
  }

  .anticon {
    margin-right: 12px;
  }
`;

const Sidebar = connect(
  ({ folders }) => ({
    folders: R.propOr([], "data", folders)
  }),
  {
    loadFolders,
    createFolder
  }
)(({ loadFolders, createFolder, folders, logout, showAddBookmark }) => {
  React.useEffect(() => {
    loadFolders();
  }, []);

  return (
    <SidebarWrapper>
      <Title>
        <span role="img" aria-labelledby="bookmarks">
          📌
        </span>
      </Title>
      <FoldersContainer>
        <Link to="/" exact style={{ marginBottom: "16px" }}>
          <Icon type="pushpin" />
          All bookmarks
        </Link>
        <h4>Folders</h4>
        <FolderList>
          {folders &&
            folders.map(folder => (
              <Link to={`/folders/${folder.id}`}>
                <Icon type="folder" />
                {folder.title}
              </Link>
            ))}
        </FolderList>
      </FoldersContainer>
      <CreateFolderButton createFolder={createFolder} />
      <BottomContainer>
        <Button
          type="primary"
          icon="plus"
          size="large"
          block={true}
          className="button"
          onClick={showAddBookmark}
          style={{ marginBottom: 12 }}
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
      </BottomContainer>
    </SidebarWrapper>
  );
});

export default Sidebar;
