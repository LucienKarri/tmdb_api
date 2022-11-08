import React, { Component } from "react";
import TMDBservice from "../../services/TMDBservice";
import { Alert, Tabs, Spin } from "antd";
import SearchTab from "../SearchTab/SearchTab";
import MovieList from "../MovieList/MovieList";

export default class TabsView extends Component {
    tmdbService = new TMDBservice();
    
    state = {
        page: 1,
        ratedMovies: null,
        error: null,
        loading: true
    }

    componentDidMount() {
        this.getRatedMovies();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.page !== this.state.page) {
            this.setState({
                loading:true,
                error: null
            });
            this.getRatedMovies();
        }
    }
/*
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
        const ratedMovies = [res];

        for (let i = 2; i <= res.total_pages; i++) {
            promises.push(this.tmdbService.getRatedMovies(i));
        }
        Promise.all(promises)
            .then((response) => {
                response.forEach((elem) => {
                    ratedMovies.push(elem)
                })
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

    onChangePage = (page) => {
        this.setState({
            page
        })
    }

    render() {
        const {ratedMovies, error, loading, page} = this.state;
        
        const hasData = !(loading || error);
        const spinner = loading ? <Spin /> : null;
        const content = hasData ? <MovieList movies={ratedMovies[page - 1]} onChangePage={this.onChangePage} /> : null;

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
            <Tabs
                defaultActiveKey="1"
                items={items}
                centered
            />
        );
    }
}
