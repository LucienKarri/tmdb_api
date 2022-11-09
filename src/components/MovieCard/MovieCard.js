import { Card, Image, Typography, Progress, List, Tag, Rate } from "antd";
import { format } from "date-fns";
import MyContext from "../MyContext/MyContext";
import TMDBservice from "../../services/TMDBservice";
import React, { Component } from "react";

const {Title, Text, Paragraph} = Typography;

export default class MovieCard extends Component {
    tmdbService = new TMDBservice();

    state = {
        rating: 0
    }

    componentDidMount() {}

    componentDidUpdate(prevProps, prevState) {}

    setColor = (value) => {
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

    onChangeRate = (value) => {
        const {movie, changeRating} = this.props;

        this.tmdbService
            .postRating(movie.id, value)
            .then((res) => console.log('rated', res))
            .catch((error) => console.log(error));
        changeRating(movie, value);
    }

    render() {
        const {movie, rating} = this.props
        const {
            poster_path,
            title,
            vote_average,
            release_date,
            genre_ids,
            overview,
        } = movie;

        return (
            <Card>
                <Image src={`https://image.tmdb.org/t/p/original${poster_path}`} preview={false} />
                <Title level={4} ellipsis={{rows: 2}}>{title}</Title>
                <Progress
                    type="circle"
                    format={() => vote_average.toFixed(1)}
                    width={40}
                    trailColor={this.setColor(vote_average)}
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
                <Rate
                    count={10}
                    allowHalf
                    style={{
                        fontSize: 20
                    }}
                    onChange={this.onChangeRate}
                    value={rating}
                />
            </Card>
        );
    }
}

/*
const MovieCard = ({movie}) => {
    const tmdbService = new TMDBservice();

    const {
        poster_path,
        title,
        vote_average,
        release_date,
        genre_ids,
        overview,
        rating,
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

    const onChangeRate = (value) => {
        tmdbService
            .postRating(id, value)
            .then((res) => console.log('rated', res))
            .catch((error) => console.log(error))
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
            <Rate
                count={10}
                allowHalf
                style={{
                    fontSize: 20
                }}
                onChange={onChangeRate}
                defaultValue={rating || 0}
            />
        </Card>
    );
}

export default MovieCard;
*/
