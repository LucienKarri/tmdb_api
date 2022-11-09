import { Card, Image, Typography, Progress, List, Tag, Rate } from "antd";
import { format } from "date-fns";
import MyContext from "../Contexts/MyContext";
import RatingContext from "../Contexts/RatingContext";
import React from "react";
import noPoster from './no-poster.svg';
import './MovieCard.css';

const {Title, Text, Paragraph} = Typography;

const MovieCard = ({movie}) => {
    const {
        poster_path,
        title,
        vote_average,
        release_date,
        genre_ids,
        overview,
        id
    } = movie;

    const setColor = (value) => {
        if (value < 3) {
            return '#E90000'
        } else if (value > 3 && value < 5) {
            return '#E97E00'
        } else if (value > 5 && value < 7) {
            return '#E9D100'
        } else {
            return '#66E900'
        }
    }

    return (
        <Card className="card">
            <Image src={`https://image.tmdb.org/t/p/original${poster_path}`} preview={false} fallback={noPoster} rootClassName="card__image" />
            <Title level={4} ellipsis={{rows: 2}} className='card__title'>{title}</Title>
            <Progress
                type="circle"
                format={() => vote_average.toFixed(1)}
                width={40}
                trailColor={setColor(vote_average)}
                className="card__progress"
            />
            <Text className="card__date">
                {format(new Date(release_date), 'LLLL d, y')}
            </Text>
            <List
                className="card__genres"
                grid={{}}
                dataSource={genre_ids}
                renderItem={(item) => (
                    <MyContext.Consumer>
                        {(genres) => (
                            <List.Item>
                                <Tag>{genres[item]}</Tag>
                            </List.Item>
                        )}
                    </MyContext.Consumer>
                )}
            />
            <Paragraph ellipsis={{rows: 3}} className="card__overview">
                {overview}
            </Paragraph>
            <RatingContext.Consumer>
                {({ratingList, onChangeRating}) => (
                    <Rate
                        className="card__rate"
                        count={10}
                        allowHalf
                        onChange={(value) => onChangeRating(movie, value)}
                        value={ratingList[id] || 0}
                    />
                )}
            </RatingContext.Consumer>
        </Card>
    );
}

export default MovieCard;
