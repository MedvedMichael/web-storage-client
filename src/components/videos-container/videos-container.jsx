import React, { Component } from 'react'
import FileDropWrapper from '../file-drop-wrapper/file-drop-wrapper'
import videoLogo from './pictures/videocam-dark.jpg'
import './videos-container.css'
import Modal from '../modal/modal'
export default class VideosContainer extends Component {

    // webStorageService = new WebStorageService()
    state = {
        editable:false,
        videos:[],
        showModal:false
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
        const {id,uploadingVideo, updateContainer} = this.props
        console.log(files)
        for(let i=0;i<files.length;i++)
            await uploadingVideo(id, files[i])

        this.setState({showModal:false})
        await updateContainer(id)
        // console.log(this.state.showModal)
    }

    showModal = () => {
        console.log(this.state.showModal)
        this.setState({showModal:true})
        console.log(this.state.showModal)
    }

    render() {

        const { videos, editable, showModal } = this.state
        const { id } = this.props

        const showVideoUploadingModalButton = (editable) ? (
            <div>
                <button type="button" className="btn btn-outline-success" onClick={this.showModal}>Upload more videos</button>
            </div>
        ) : null
        const addVideosButton = (editable) ? (
            <div className="add-videos-button">
                <label htmlFor="file-upload" className="btn btn-outline-success custom-file">
                    Upload videos
                </label>
                <input multiple="multiple" onChange={({ target }) => this.uploadingVideos(target)} id="file-upload" type="file" className="custom-file-input" />
            </div>
        ) : null

        const addAndDeleteButtonGroup = (editable) ? (
            <div className="add-delete-btn-container">
                <div className="add-delete-btn-group btn-group">
                    {showVideoUploadingModalButton}
                </div>
            </div>) : null

        const modal = (showModal) ? (
            <Modal show={showModal} onClose={() => this.setState({ showModal: false })} title="Uploading video">
                <ul className="nav">

                    <li className="nav-item">
                        <h2>Upload your local files</h2>
                    </li>
                    <li className="nav-item">
                        <FileDropWrapper extraClassName="border-light" editable onFilesAdded={this.uploadingVideos}>
                            <div>
                                <div className="col-lg-12 video-uploading-modal-card">
                                    <div className="video-uploading-text card-body">
                                        <h4 className="">Drop videos here</h4>
                                    </div>
                                </div>
                            </div>

                        </FileDropWrapper>
                        <div style={{ display: 'flex' }} className="btn-group">
                            {addVideosButton}
                        </div>
                    </li>
                </ul>
            </Modal>
        ) : null

        if (!videos || videos.length === 0)
            return (
                <div>
                {modal}
                <FileDropWrapper editable={editable} key={id} onFilesAdded={this.uploadingVideos}>
                    <h3 className="error-message">There's no content</h3>
                    {addAndDeleteButtonGroup}
                </FileDropWrapper>
                </div>
                );

        const videosViews = (videos.length === 0)?(<h4 className="no-content">There's no content</h4>):videos.map(({name, id}, index) => (
            <div key={`video${index}`} className="video-card card" onClick={()=>this.onVideoViewClick(id)}>
                <h5 className="card-header">{name}</h5>
                <div className="card-body">
                    <img src={videoLogo} alt="img"/>
                </div>
            </div>
        ))


        

        return (
            <div>
                {modal}
                <FileDropWrapper editable={editable} key={id} onFilesAdded={this.uploadingVideos}>
                    <h2 className="videos-module-title">Videos</h2>
                    <div className="card">
                        <div className="row">
                            {videosViews}
                        </div>
                        {addAndDeleteButtonGroup}
                    </div>
                </FileDropWrapper>
            </div>
        )
    }
}



