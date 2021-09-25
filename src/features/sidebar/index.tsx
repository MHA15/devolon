import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "store";
import styled from "@emotion/styled";
import logo from "logo.svg";
import { fetchCategories } from "./slice";
import { Link } from "react-router-dom";
import { mediaQuery } from "utils/css-commons";
import Loading from "components/loading";
import ErrorMessage from "components/error-message";

const Logo = styled.img``;

const CategoriesList = styled.div``;

const CategoryItem = styled(Link)`
  display: block;
  text-align: center;
  padding: 0.25rem;
`;

const SideBarContainer = styled.div`
  flex: 0 1;
  width: 6rem;
  height: 100%;
  background: bisque;
  padding: 1rem;

  ${Logo} {
    width: 100%;
    height: 5rem;
    pointer-events: none;
  }

  ${CategoriesList} {
    display: flex;
    width: 100%;
    flex-direction: column;
  }

  ${mediaQuery.sm} {
    width: calc(100% - 2rem);
    height: 3rem;
    display: flex;

    ${Logo} {
      width: 5rem;
      height: 100%;
    }

    ${CategoriesList} {
      align-items: center;
      flex-wrap: wrap;
      flex-direction: row;
    }
  }
`;

const Sidebar: React.FC = () => {
  const { value, loading, error } = useAppSelector((state) => state.categories);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  return (
    <SideBarContainer>
      <Logo src={logo} alt="logo" />
      {loading && <Loading id="sidebar-loading" />}
      {error && <ErrorMessage id="sidebar-error">{error}</ErrorMessage>}
      <CategoriesList data-testid="categories-list">
        {value.map((category) => (
          <CategoryItem key={category.id} to={"./" + category.id}>
            {category.name}
          </CategoryItem>
        ))}
      </CategoriesList>
    </SideBarContainer>
  );
};

export default Sidebar;
