import React, { Component } from 'react';
import WebStorageService from '../../services/web-storage-service';
import videoLogo from './pictures/videocam-dark.jpg'
import './videos-module.css'
export default class VideosModule extends Component {

    webStorageService = new WebStorageService()
    state = {
        videos:[]
    }

    componentDidMount = async () => {
        const {id} = this.props
        const videos = await this.webStorageService.getVideosOfVideoset(id)
        this.setState({videos})
    }


    render() {

        const {videos} = this.state

        

        const videosViews = (videos.length === 0)?(<h4 className="no-content">There's no content</h4>):videos.map(({name}, index) => (
            <div key={`video${index}`} className="video-card card">
                <h5 className="card-header">{name}</h5>
                <div className="card-body">
                    <img src={videoLogo} alt="img"/>
                </div>
            </div>
        ))



        return (
            <div>
                <h2 className="videos-module-title">Videos</h2>
                <div className="card">
                    <div className="row">
                        {videosViews}
                    </div>
                </div>
            </div>
             
        )
    }


}