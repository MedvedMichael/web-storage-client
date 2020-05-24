import React, { Component } from 'react'
import FileDropWrapper from '../file-drop-wrapper/file-drop-wrapper'
import videoLogo from './pictures/videocam-dark.jpg'
import './videos-container.css'
export default class VideosContainer extends Component {

    // webStorageService = new WebStorageService()
    state = {
        editable:false,
        videos:[]
    }

    componentDidMount = async () => {
        const {videos, editable} = this.props
        
        this.setState({ videos, editable: (editable) ? editable : false })
    }

    onVideoViewClick = (id) => {
        const {videos} = this.state
        const currentVideo = videos.find((video)=>video.id === id)
        this.props.onVideoClick(currentVideo)
    }


    uploadingVideos = async ({files}) => {
        const {id,uploadingVideo} = this.props
        for(let i=0;i<files.length;i++)
            await uploadingVideo(id, files[i])
    }

    render() {

        const {videos, editable} = this.state
        const {id} = this.props
        const addPictureButton = (editable)?(
            <div>
                <label htmlFor="file-upload" className="btn btn-outline-success custom-file">
                    Upload videos
                </label>
                <input multiple="multiple" onChange={({target})=>this.onPictureAdded(target)} id="file-upload" type="file" className="custom-file-input" />
            </div>
        ):null

        if (!videos || videos.length === 0)
            return (
                <FileDropWrapper editable={editable} key={id} onFilesAdded={this.uploadingVideos}>
                    <h3 className="error-message">There's no content</h3>
                    <div className="add-delete-btn-container">
                        <div className="add-delete-btn-group btn-group">
                            {addPictureButton}
                        </div>
                    </div>
                </FileDropWrapper>);



        const addAndDeleteButtonGroup = (editable) ? (
            <div className="add-delete-btn-container">
                <div className="add-delete-btn-group btn-group">
                    {addPictureButton}
                </div>
            </div>) : null



        

        const videosViews = (videos.length === 0)?(<h4 className="no-content">There's no content</h4>):videos.map(({name, id}, index) => (
            <div key={`video${index}`} className="video-card card" onClick={()=>this.onVideoViewClick(id)}>
                <h5 className="card-header">{name}</h5>
                <div className="card-body">
                    <img src={videoLogo} alt="img"/>
                </div>
            </div>
        ))



        return (
            <FileDropWrapper editable={editable} key={id} onFilesAdded={({files})=>this.props.uploadingVideo(id, files[0])}>
                <h2 className="videos-module-title">Videos</h2>
                <div className="card">
                    <div className="row">
                        {videosViews}
                    </div>
                    {addAndDeleteButtonGroup}
                </div>
            </FileDropWrapper>
             
        )
    }
}



