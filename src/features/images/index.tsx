import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { imagesActions, fetchImagesByCategory } from "./slice";
import { RootState } from "store";
import styled from "@emotion/styled";
import Button from "components/button";
import { css } from "@emotion/css";
import { useParams } from "react-router-dom";
import ErrorMessage from "components/error-message";
import Loading from "components/loading";
import { mediaQuery } from "utils/css-commons";

const Frame = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10rem;
  height: 10rem;
  background: burlywood;
  border-radius: 1.25rem;
  margin: 1rem;

  ${mediaQuery.sm} {
    width: 8rem;
    height: 8rem;
    margin: 0.5rem;
  }

  img {
    max-width: 80%;
    max-height: 80%;
  }
`;

const Images: React.FC = () => {
  const { value, error, loading } = useSelector(
    (state: RootState) => state.images
  );
  const dispatch = useDispatch();
  const { categoryId } = useParams<{ categoryId: string }>();

  useEffect(() => {
    dispatch(imagesActions.clear());
    dispatch(fetchImagesByCategory(categoryId));
  }, [categoryId]);

  return (
    <div
      className={css`
        overflow: auto;
        flex: 1;
        display: flex;
        flex-direction: column;
      `}
    >
      <div
        data-testid="images-container"
        className={css`
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;

          ${mediaQuery.sm} {
            justify-content: center;
          }
        `}
      >
        {value.map((image, index) => (
          <Frame key={index}>
            <img src={image.url} alt={image.id} />
          </Frame>
        ))}
      </div>
      {loading && <Loading data-testid="images-loading" />}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Button
        aria-label="load more images"
        data-testid="load-more"
        onClick={() => dispatch(fetchImagesByCategory(categoryId))}
        disabled={loading}
      >
        Load More
      </Button>
    </div>
  );
};

export default Images;
