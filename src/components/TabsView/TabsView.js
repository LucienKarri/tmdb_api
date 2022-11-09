import React, { Component } from "react";
import TMDBservice from "../../services/TMDBservice";
import { Alert, Tabs } from "antd";
import SearchTab from "../SearchTab/SearchTab";
import MovieList from "../MovieList/MovieList";
import RatingContext from "../Contexts/RatingContext";
import Spinner from "../Spinner/Spinner";

export default class TabsView extends Component {
    tmdbService = new TMDBservice();
    
    state = {
        ratedMovies: null,
        error: null,
        loading: true,
        ratingList: {}
    }

    componentDidMount() {
        if (!JSON.parse(localStorage.getItem('guest_session_id'))) {
            this.tmdbService
                .newGuestSession()
                .then((id) => {
                    localStorage.setItem('guest_session_id', JSON.stringify(id));
                    this.getRatedMovies();
                })
                .catch((error) => {
                    this.setState({
                        isError: <Alert type="error" message={error.name} description={error.message} />
                    })
                });
        } else {
            this.getRatedMovies();
        }
    }

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
        }, {});
        this.setState({
            ratingList: res
        });
    }
    
    onChangePage = (page) => {
        this.setState({
            ratedMovies: {...this.state.ratedMovies, page}
        });
    }

    onChangeRating = (movie, value) => {
        this.tmdbService
            .postRating(movie.id, value)
            .catch((error) => console.log(error));
        if (!this.state.ratingList[movie.id]) {
            const newArr = [movie, ...this.state.ratedMovies.results];
            this.setState({
                ratedMovies: {...this.state.ratedMovies, results: newArr},
                ratingList: {...this.state.ratingList, [movie.id]: value},
                error: null
            });
        } else {
            this.setState({
                ratingList: {...this.state.ratingList, [movie.id]: value}
            });
        }
    }

    render() {
        const {ratedMovies, error, loading, ratingList} = this.state;

        const hasData = !(loading || error);
        const spinner = loading ? <Spinner /> : null;
        const content = hasData ? <MovieList movies={ratedMovies} onChangePage={this.onChangePage} /> : null;

        const items = [
            {
                label: 'Search',
                key: '1',
                children: <SearchTab />
            },
            {
                label: 'Rated',
                key: '2',
                children: <>{spinner}{error}{content}</>
            }
        ];
    
        return (
            <RatingContext.Provider
                value={{
                    ratingList,
                    onChangeRating: this.onChangeRating
                }}
            >
                <Tabs
                    defaultActiveKey="1"
                    items={items}
                    centered
                    tabBarStyle={{marginLeft: 'auto', marginRight: 'auto'}}
                />
            </RatingContext.Provider>
        );
    }
}
