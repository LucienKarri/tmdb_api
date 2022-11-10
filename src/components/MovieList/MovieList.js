import { List } from 'antd';
import React from 'react';

import MovieCard from '../MovieCard';

const MovieList = ({ movies, onChangePage }) => {
  const { results, total_pages, page } = movies;

  return (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 1,
        md: 2,
        lg: 2,
        xl: 2,
        xxl: 2,
      }}
      dataSource={results}
      renderItem={(item) => (
        <List.Item key={item.id}>
          <MovieCard movie={item} />
        </List.Item>
      )}
      pagination={{
        showSizeChanger: false,
        hideOnSinglePage: true,
        pageSize: 20,
        current: page,
        total: total_pages * 20,
        onChange: onChangePage,
        style: { textAlign: 'center' },
      }}
    />
  );
};

export default MovieList;
