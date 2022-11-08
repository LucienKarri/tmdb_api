import { Alert, Layout, Spin} from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { Component } from "react";
import { Online, Offline } from "react-detect-offline";

import TMDBservice from "../../services/TMDBservice";
import MyContext from "../MyContext/MyContext";
import TabsView from "../TabsView/TabsView";
import './App.css';

export default class App extends Component {
    tmdbService = new TMDBservice();

    state = {
        genres: null,
        error: null,
        loading: true
    }

    componentDidMount() {
        if (!JSON.parse(localStorage.getItem('guest_session_id'))) {
            this.tmdbService
                .newGuestSession()
                .then((id) => {
                    localStorage.setItem('guest_session_id', JSON.stringify(id));
                })
                .catch((error) => {
                    this.setState({
                        isError: <Alert type="error" message={error.name} description={error.message} />
                    })
                });
        }
        this.getGenres();
    }

    getGenres = () => {
        this.tmdbService
            .getGenres()
            .then((genres) => {
                const res = this.transformGenres(genres);
                this.setState({
                    genres: res,
                    loading: false
                });
            })
            .catch((error) => {
                this.setState({
                    error: <Alert type="error" message={error.name} description={`${error.message}. The service may not be available in your country.`} />,
                    loading: false
                })
            })
    }

    transformGenres = (genres) => {
        const res = genres.genres.reduce((total, {id, name}) => {
            total[id] = name;
            return total;
        }, {})

        return res;
    }

    render() {
        const {genres, error, loading} = this.state;

        const hasData = !(loading || error);
        const spinner = loading ? <Spin /> : null;
        const content = hasData ? <TabsView /> : null;

        return (
            <Layout>
                <Content>
                    <Offline>
                        <Alert
                            message="Error"
                            description="No internet connection"
                            type="error"
                            showIcon
                        />
                    </Offline>
                    <Online>
                        {spinner}
                        {error}
                        <MyContext.Provider value={genres}>
                            {content}
                        </MyContext.Provider>
                    </Online>
                </Content>
            </Layout>
        );
    }
}
