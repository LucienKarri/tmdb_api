import { List } from "antd";
import React from "react";
import MovieCard from "../MovieCard/MovieCard";

const MovieList = ({movies, onChangePage}) => {
    const {results, total_pages, page} = movies;

    return (
        <List 
            dataSource={results}
            renderItem={(item) => (
                <List.Item>
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
                style: {textAlign: "center"}
            }}
        />
    );
}

export default MovieList;
