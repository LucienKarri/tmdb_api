import { Card, Image, Typography, Progress, List, Tag, Rate } from "antd";
import { format } from "date-fns";
import MyContext from "../Contexts/MyContext";
import RatingContext from "../Contexts/RatingContext";
import React from "react";

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
        <Card>
            <Image src={`https://image.tmdb.org/t/p/original${poster_path}`} preview={false} />
            <Title level={4} ellipsis={{rows: 2}}>{title}</Title>
            <Progress
                type="circle"
                format={() => vote_average.toFixed(1)}
                width={40}
                trailColor={setColor(vote_average)}
            />
            <Text>
                {format(new Date(release_date), 'MMMM d, y')}
            </Text>
            <List
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
            <Paragraph ellipsis={{rows: 3}}>
                {overview}
            </Paragraph>
            <RatingContext.Consumer>
                {({ratingList, onChangeRating}) => (
                    <Rate
                        count={10}
                        allowHalf
                        style={{
                            fontSize: 20
                        }}
                        onChange={(value) => onChangeRating(movie, value)}
                        value={ratingList[id] || 0}
                    />
                )}
            </RatingContext.Consumer>
        </Card>
    );
}

export default MovieCard;

