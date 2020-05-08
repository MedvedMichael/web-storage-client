import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom' 
import Header from '../header/header'
import VideosetPage from '../videoset-page/videoset-page'
import WebStorageService from '../../services/web-storage-service'
import CategoryPage from '../category-page/category-page'

const App = () => {

    const webStorageService = new WebStorageService()
    return (
        <div>
            <Router>
                <Header />
                <Route path="/" component={CategoryPage} exact={true} />
                <Route path="/videosets/:id"
                    render={({ match }) => {

                        return <VideosetPage id={match.params.id} getData={webStorageService.getVideoset} /> //TODO
                    }} />

            </Router>
        </div>
    )


}
export default App