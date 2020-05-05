import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom' 
import Header from '../header'
import VideosetPage from '../videoset-page'
import WebStorageService from '../../services/web-storage-service'
import CategoryPage from '../category-page'

export default class App extends Component{

    webStorageService = new WebStorageService()
    state = {

    }

    render(){
        
        return(
            <div>
                <Router> 
                    <Header />
                    <Route path="/" component={CategoryPage} exact={true}/>
                    <Route path="/videosets/:id" 
                    render={({match})=>{
                        
                        return <VideosetPage id={match.params.id} getData={this.webStorageService.getVideoset} /> //TODO
                    }}/>
                
                 </Router>
            </div>
        )
    }

}