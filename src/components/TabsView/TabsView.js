import React, { Component } from "react";
import TMDBservice from "../../services/TMDBservice";
import { Alert, Tabs, Spin } from "antd";
import SearchTab from "../SearchTab/SearchTab";
import MovieList from "../MovieList/MovieList";

export default class TabsView extends Component {
    tmdbService = new TMDBservice();
    
    state = {
        ratedMovies: null,
        error: null,
        loading: true,
        ratingList: {}
    }

    componentDidMount() {
        this.getRatedMovies();
    }

/*
    componentDidUpdate(prevProps, prevState) {
        if (prevState.page !== this.state.page) {
            this.setState({
                loading:true,
                error: null
            });
            this.getRatedMovies();
        }
    }

    getRatedMovies = () => {
        this.tmdbService
            .getRatedMovies(this.state.page)
            .then((ratedMovies) => {
                if (ratedMovies.total_results === 0) {
                    this.setState({
                        error: <Alert type="info" message="You haven't rated any movies yet" />
                    })
                }
                this.setState({
                    ratedMovies,
                    loading: false
                })
            })
            .catch((error) => {
                this.setState({
                    error: <Alert type="error" message={error.name} description={`${error.message}. The service may not be available in your country.`} />,
                    loading: false
                })
            })
    }
*/

    getRatedMovies = () => {
        this.tmdbService
            .getRatedMovies(1)
            .then((res) => {
                if (res.total_results === 0) {
                    this.setState({
                        error: <Alert type="info" message="You haven't rated any movies yet" />
                    })
                }
                if (res.total_pages === 1) {
                    this.getRatingList(res);
                    this.setState({
                        ratedMovies: res,
                        loading: false
                    })
                } else {
                    this.getAllRatedMovies(res);
                }
            })
            .catch((error) => {
                this.setState({
                    error: <Alert type="error" message={error.name} description={`${error.message}. The service may not be available in your country.`} />,
                    loading: false
                })
            })
    }

    getAllRatedMovies = (res) => {
        const promises = [];
        const ratedMovies = res;

        for (let i = 2; i <= res.total_pages; i++) {
            promises.push(this.tmdbService.getRatedMovies(i));
        }
        Promise.all(promises)
            .then((response) => {
                response.forEach((elem) => {
                    ratedMovies.results.push(...elem.results)
                })
                this.getRatingList(ratedMovies);
                this.setState({
                    ratedMovies,
                    loading: false
                })
            })
            .catch((error) => {
                this.setState({
                    error: <Alert type="error" message={error.name} description={`${error.message}. The service may not be available in your country.`} />,
                    loading: false
                })
            })
    }

    getRatingList = (ratedMovies) => {
        const res = ratedMovies.results.reduce((total, elem) => {
            total[elem.id] = elem.rating;
            return total;
        }, {})
        this.setState({
            ratingList: res
        });
    }
    
    onChangePage = (page) => {
        this.setState({
            ratedMovies: {...this.state.ratedMovies, page}
        })
    }

    onChangeRating = (movie, value) => {
        if (!this.state.ratingList[movie.id]) {
            this.state.ratedMovies.results.unshift(movie)
            console.log('new element', this.state.ratedMovies.results)
        }
        this.setState({
            ratingList: {...this.state.ratingList, [movie.id]: value}
        })
    }

    render() {
        const {ratedMovies, error, loading, ratingList} = this.state;

        const hasData = !(loading || error);
        const spinner = loading ? <Spin /> : null;
        const content = hasData ? <MovieList movies={ratedMovies} onChangePage={this.onChangePage} list={ratingList} changeRating={this.onChangeRating}/> : null;

        const items = [
            {
                label: 'Search',
                key: '1',
                children: <SearchTab list={ratingList} changeRating={this.onChangeRating} />
            },
            {
                label: 'Rated',
                key: '2',
                children: <>{spinner}{error}{content}</>
            }
        ];
    
        return (
            <Tabs
                defaultActiveKey="1"
                items={items}
                centered
            />
        );
    }
}
