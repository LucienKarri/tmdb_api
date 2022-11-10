import { Alert, Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import React, { Component } from 'react';
import { Online, Offline } from 'react-detect-offline';

import TMDBservice from '../../services/TMDBservice';
import MyContext from '../../contexts/MyContext';
import Spinner from '../Spinner';
import TabsView from '../TabsView';
import './App.css';

export default class App extends Component {
  tmdbService = new TMDBservice();

  state = {
    genres: null,
    error: null,
    loading: true,
  };

  componentDidMount() {
    this.getGenres();
  }

  getGenres = () => {
    this.tmdbService
      .getGenres()
      .then((genres) => {
        const res = this.transformGenres(genres);
        this.setState({
          genres: res,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          error: (
            <Alert
              type="error"
              message={error.name}
              description={`${error.message}. The service may not be available in your country.`}
            />
          ),
          loading: false,
        });
      });
  };

  transformGenres = (genres) => {
    return genres.genres.reduce((total, { id, name }) => {
      total[id] = name;
      return total;
    }, {});
  };

  render() {
    const { genres, error, loading } = this.state;

    const hasData = !(loading || error);
    const spinner = loading ? <Spinner /> : null;
    const content = hasData ? <TabsView /> : null;

    return (
      <Layout>
        <Content>
          <div className="wrapper">
            <Offline>
              <Alert message="Error" description="No internet connection" type="error" />
            </Offline>
            <Online>
              {spinner}
              {error}
              <MyContext.Provider value={genres}>{content}</MyContext.Provider>
            </Online>
          </div>
        </Content>
      </Layout>
    );
  }
}
