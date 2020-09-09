import React, { Component } from 'react'
import FileDropWrapper from '../file-drop-wrapper/file-drop-wrapper'
import videoLogo from './pictures/videocam-dark.jpg'
import './videos-container.css'
import Modal from '../modal/modal'
import Url from 'url-parse'
export default class VideosContainer extends Component {

    // webStorageService = new WebStorageService()
    state = {
        editable:false,
        editableName:false,
        videos:[],
        showModal:false,
        inputFormURL:null,
        name:'' //TODO
    }

    componentDidMount = async () => {
        const {videos, editable, name} = this.props
        this.setState({ name: name ? name : "", videos, editable: (editable) ? editable : false })
    }

    onVideoViewClick = (id) => {
        const {videos} = this.state
        const currentVideo = videos.find((video)=>video.id === id)
        this.props.onVideoClick(currentVideo)
    }


    uploadingVideos = async ({files}) => {
        const {id,uploadingVideo, updateContainer} = this.props

        for(let i=0;i<files.length;i++)
            await uploadingVideo(id, files[i])

        this.setState({showModal:false})
        await updateContainer(id)

    }

    showModal = () => {
        this.setState({ showModal: true })
    }

    uploadingURLVideo = async () => {
        const {inputFormURL} = this.state

        const url = new Url(inputFormURL)
        const hostname = url.hostname
        if(hostname === 'www.youtube.com'){
            const queryString = url.query
            const queryParams = new URLSearchParams(queryString.slice(1))

            const value = queryParams.get('v')
            const newURL = `https://www.youtube.com/embed/${value}`
            const name = prompt('Input video name: ', 'Video')
            await this.props.uploadingURLVideo(this.props.id,name, newURL)

        }
        else {
            const name = prompt('Input video name: ', 'Video')
            await this.props.uploadingURLVideo(this.props.id,name, inputFormURL)
        }
        this.setState({showModal:false})


    }

    saveTitle() {
        const {name} = this.state
        this.props.saveTitle(name, this.props.id)
    }


    render() {

        const { videos, editable, showModal, name, editableName } = this.state
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
                <div className="d-flex list-group nav-pills">
                    <div className="video-modal-line">
                        <h2>Upload video from compatible services</h2>
                        <h4>(YouTube, Google Drive, Yandex Disk)</h4>
                    </div>

                    <div className="video-modal-line input-group">
                        <input className="form-control form-control-lg" onChange={({ target }) => this.setState({ inputFormURL: target.value })} />
                        <div className="input-group-append">
                            <button className="btn btn-primary" type="button" onClick={this.uploadingURLVideo}>Upload</button>
                        </div>
                    </div>

                    <div className="video-modal-line">
                        <h2 style={{ textAlign: 'center' }}>OR</h2>
                    </div>

                    <div className="video-modal-line">
                        <h2>Upload your local videos</h2>
                    </div>

                    <div className="video-modal-line">
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
                    </div>
                    {/* </li> */}
                </div>
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

        const closeButton = (video) => editable ? (
            <button className="btn btn-outline-danger" onClick={() => { this.props.deletingVideo(video) }}>
                Delete video
            </button>
        ) : null

        const videosViews = (videos.length === 0)
        ? (<h4 className="no-content">There's no content</h4>)
            : videos.map(({ name, id, owner }, index) => (
            <div className="flex video-card" key={`video${index}`}>
                <div  className="card" onClick={(target ) => {
                        console.log(target)
                        if (target !== 'button.btn.btn-outline-danger')
                            this.onVideoViewClick(id)
                    }}>

                        <div className="card-header">
                            <h5 >{name}</h5>
                        </div>
                        <div className="card-body">
                            <img src={videoLogo} alt="img" />
                        </div>
                    </div>
                    <div className="card">
                        <div className="btn-group">
                            {closeButton({ id, owner })}
                        </div>
                    </div>
                </div>
            ))


        const title = (
            <div className="flex">
                <ul className="nav nav-pills">
                    <li>
                        {!editable || !editableName
                        ? <h2 className="videos-module-title">{name ? name : 'Videos'}</h2>
                        : <input className="form-control videos-container-title" rows="1" onChange={({ target }) => { this.setState({ name: target.value }) }} value={name}></input>}
                    </li>
                    {editable ? <li className="change-container-title btn-group">
                        {!editableName
                        ? <button className="btn btn-success" onClick={() => { this.setState({ editableName: true }) }}>Change title</button>
                        : <button className="btn btn-success" onClick={() => { this.saveTitle() }}>Save changes</button>}
                    </li> : null}
                </ul>
            </div>)



        return (
            <div>
                {modal}
                <FileDropWrapper editable={editable} key={id} onFilesAdded={this.uploadingVideos}>
                    {title}
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                {videosViews}
                            </div>
                        </div>
                        {addAndDeleteButtonGroup}
                    </div>
                </FileDropWrapper>
            </div>
        )
    }
}



