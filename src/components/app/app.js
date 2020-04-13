import React, { Component } from 'react';
import Header from '../header'
import WebStorageService from '../../services/web-storage-service'
import CategoryPage from '../category-page'
export default class App extends Component{

    webStorageService = new WebStorageService()
    state = {

    }

    render(){        
        return(
            <div>
                <Header />
                <CategoryPage/>
            
            </div>
        )
    }

}