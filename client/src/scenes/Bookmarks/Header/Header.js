import React from "react";
import * as R from "ramda";
import styled from "styled-components/macro";
import { connect } from "react-redux";
import qs from "qs";
import { Input } from "antd";

const Wrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  padding: 8px 30px;
  border-bottom: 1px solid #dee2e6;
  box-shadow: 0px 1px 1px 0 rgba(0, 0, 0, 0.05);

  .folder-icon {
    font-size: 28px;
    margin-right: 16px;
  }
`;

const Header = connect(({ folders }, { folderId }) => ({
  folder: R.pipe(
    R.propOr([], "data"),
    R.find(R.propEq("id", folderId)),
    R.defaultTo({})
  )(folders)
}))(({ history, location, folder }) => {
  const [search, setSearch] = React.useState("");
  const queryString = qs.parse(location.search, { ignoreQueryPrefix: true });

  React.useEffect(() => {
    setSearch(queryString.search);
  }, []);

  const updateSearchParam = search => {
    const newQueryString = qs.stringify({
      ...queryString,
      search: search || undefined
    });
    history.push({
      search: newQueryString
    });
  };

  return (
    <Wrapper>
      <span className="folder-icon">{folder.icon}</span>
      <Input.Search
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder={folder.title}
        onSearch={updateSearchParam}
      />
    </Wrapper>
  );
});

export default Header;
