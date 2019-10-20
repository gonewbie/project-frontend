import React from 'react';
import { RouteComponentProps } from '@reach/router';
import Banner from './Banner';
import MainView from './MainView';
import Tags from './Tags';
import { ArticlesProvider } from '../../context/articles';

export default function Home(_: RouteComponentProps) {
  return (
    <div className="home-page">
      <Banner />
      <div className="container page">
        <div className="row">
          <ArticlesProvider>
            <MainView />
            <Tags />
          </ArticlesProvider>
        </div>
      </div>
    </div>
  );
}
