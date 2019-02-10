import React from "react";
import * as R from "ramda";
import { connect } from "react-redux";
import { Button, Icon } from "antd";
import { NavLink as RRNavLink } from "react-router-dom";
import styled from "styled-components/macro";

import CreateFolderButton from "./CreateFolderButton";
import FolderForm from "./FolderForm";
import {
  loadFolders,
  createFolder,
  editFolder,
  deleteFolder
} from "../../../store/folders";

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
  justify-content: start;
  color: #212529;

  &:hover,
  &:focus {
    background-color: rgba(0, 0, 0, 0.1);
    text-decoration: none;
    .edit-btn {
      display: inline-block;
    }
  }

  .edit-btn {
    margin-left: auto;
    display: none;
  }

  &.active {
    background-color: #339af0;
    color: #f8f9fa;
  }
`;

const FolderIcon = styled.div`
  display: inline-flex;
  width: 20px;
  height: 20px;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-right: 12px;
`;

const Sidebar = connect(
  ({ folders }) => ({
    folders: folders.data,
    isEditFolderLoading: folders.isEditFolderLoading,
    isDeleteFolderLoading: folders.isDeleteFolderLoading
  }),
  {
    loadFolders,
    createFolder,
    editFolder,
    deleteFolder
  }
)(
  ({
    loadFolders,
    createFolder,
    editFolder,
    deleteFolder,
    folders,
    logout,
    showAddBookmark,
    isEditFolderLoading,
    isDeleteFolderLoading
  }) => {
    const [folderModal, setFolderModal] = React.useState({
      isOpen: false,
      id: undefined
    });

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
            <FolderIcon>
              <Icon type="pushpin" className="folder-icon" />
            </FolderIcon>
            <span style={{ marginTop: 4 }}>All bookmarks</span>
          </Link>
          <h4>Folders</h4>
          <FolderList>
            {folders &&
              folders.map(folder => (
                <Link to={`/folders/${folder.id}`} key={folder.id}>
                  {folder.icon ? (
                    <FolderIcon>{folder.icon}</FolderIcon>
                  ) : (
                    <FolderIcon>
                      <Icon type="folder" className="folder-icon" />
                    </FolderIcon>
                  )}
                  <span style={{ marginTop: 4 }}>{folder.title}</span>
                  <Button
                    onClick={() =>
                      setFolderModal({ isOpen: true, id: folder.id })
                    }
                    className="edit-btn"
                    icon="edit"
                  />
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
        {folderModal.isOpen && (
          <FolderForm
            handleDelete={() => deleteFolder(folderModal.id)}
            handleUpdate={folderData => editFolder(folderData, folderModal.id)}
            folder={R.pipe(
              R.find(R.propEq("id", folderModal.id)),
              R.defaultTo({})
            )(folders)}
            isLoadingEdit={isEditFolderLoading}
            isLoadingDelete={isDeleteFolderLoading}
            visible={folderModal.isOpen}
            closeModal={() => setFolderModal({ isOpen: false, id: undefined })}
          />
        )}
      </SidebarWrapper>
    );
  }
);

export default Sidebar;
