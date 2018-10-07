import React from "react";
import { Button } from "antd";
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

export default ({ logout, showAddBookmark }) => {
  return (
    <Sidebar>
      <Title>📌</Title>
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
