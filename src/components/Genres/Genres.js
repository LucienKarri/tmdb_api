import React from 'react';
import { List, Tag } from 'antd';

import MyContext from '../../contexts/MyContext';

const Genres = ({ genre_ids }) => {
  return (
    <List
      className="card__genres"
      grid={{}}
      dataSource={genre_ids}
      locale={{
        emptyText: 'No information about genres',
      }}
      renderItem={(item) => (
        <MyContext.Consumer>
          {(genres) => (
            <List.Item key={item}>
              <Tag>{genres[item]}</Tag>
            </List.Item>
          )}
        </MyContext.Consumer>
      )}
    />
  );
};

export default Genres;
