import React from 'react';
import { Rate } from 'antd';

import RatingContext from '../../contexts/RatingContext';

const Rating = ({ movie }) => {
  return (
    <RatingContext.Consumer>
      {({ ratingList, onChangeRating }) => (
        <Rate
          className="card__rate"
          count={10}
          allowHalf
          onChange={(value) => onChangeRating(movie, value)}
          value={ratingList[movie.id] || 0}
        />
      )}
    </RatingContext.Consumer>
  );
};

export default Rating;
