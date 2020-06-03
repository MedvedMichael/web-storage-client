import React, { Component } from 'react';
import PictureSlider from '../picture-slider/picture-slider';
import WebStorageService from '../../services/web-storage-service';
import EditorContext from '../drag-n-drop/editor-context';
import VerticalColumn from '../vertical-column/vertical-column';
import VideosetDescription from '../videoset-description/videoset-description';
import EditorBar from '../editor-bar/editor-bar'
import VideosContainer from '../videos-container/videos-container';
import VideoPlayer from '../video-player/video-player'
import './videoset-editor-page.css'
import Modal from '../modal/modal'
import Url from 'url-parse'

export default class VideosetEditorPage extends Component {

    webStorageService = new WebStorageService()

    state = {
        data: null,
        startData: null,
        columnId: 0,
        itemList: [],
        videosetId: null,
        counters: {

        },
        deleted: [],
        added: [],
        videoPlayer: null,
        showModal: false,
        showVideoUploadingModal:false
    }

    onDragEnd = async (result) => {
        const { destination, source } = result;

        if (!destination) { return }

        const { itemList } = this.state;
        const movedPart = itemList.splice(source.index, 1)[0];
        itemList.splice(destination.index, 0, movedPart)
       
        this.setState({ itemList })
        

    }

    async componentDidMount() {
        const { id } = this.props
        const { getVideoset, getSubcategory } = this.webStorageService
        const videosetData = await getVideoset(id)
        const subcategoryData = await getSubcategory(videosetData.owner)
        this.setState({ videosetId: id, data: videosetData, startData: videosetData, subcategoryData })    
        
        this.initialAddingItems()
    }

    initialAddingItems = async () => {

        const { data } = this.state
        const { order } = data
        

        for (let i = 0; i < order.length; i++) {
            const element = order[i]
            
            if (element.type === 'VideosetDescription' && element.value !== null) {
                this.addItemToColumn(VideosetDescription, { text: element.value, saveDescription:this.saveDescription, editable: true })
            }
            else if (element.type === 'PictureSlider' && element.value) {
                const dataURLs = await this.webStorageService.getPicturesOfSlider(element.value)
                
                this.addItemToColumn(PictureSlider, { id: element.value, dataURLs, editable: true, uploadingPicture: this.uploadingPicture, deletingPicture: this.deletingPicture })
            }

            else if (element.type === 'VideosContainer' && element.value) {
                const videos = await this.webStorageService.getVideosOfVideosContainer(element.value)
                await this.addItemToColumn(VideosContainer, { id: element.value, videos, uploadingURLVideo: this.uploadingURLVideo, updateContainer: this.updateContainer, editable: true, onVideoClick: this.onVideoClick, uploadingVideo: this.uploadingVideo })
            }
        }

    }

    uploadingPicture = async (id, slideIndex, picture) => {
        const res = await this.webStorageService.postPicture(id, picture)
        if (!res.ok) {
            
            return
        }
        // const dataURLs = await this.webStorageService.getPicturesOfSlider(this.props.id)
        this.updateSlider(id, slideIndex)
    }

    deletingPicture = async (id, slideIndex, path) => {
        let i = path.length - 1
        while (path[i] !== '/') i--
        const pictureId = path.substring(i + 1)

        const res = await this.webStorageService.deletePhoto(pictureId)

        if (res.error)
            return

        this.updateSlider(id, slideIndex)


    }

    deletingVideo = async ({ id, owner }) => {
        const res = await this.webStorageService.deleteVideo(id)

        if (res.error)
            return

        await this.updateContainer(owner)
        this.setState({ showModal: false })


    }

    updateSlider = async (id, slideIndex) => {
        const { itemList } = this.state
        const dataURLs = await this.webStorageService.getPicturesOfSlider(id)

        const indexOfElement = itemList.findIndex((item) => item.props.id === id);
        const newSlider = <PictureSlider {...itemList[indexOfElement].props} dataURLs={dataURLs} slideIndex={(slideIndex > 0) ? slideIndex - 1 : null} />
        itemList[indexOfElement] = newSlider

        this.setState({ itemList })
    }


    addItemToColumn = (ReactComponent, props = {}) => {
        const { itemList, counters } = this.state

        if (!counters[ReactComponent.name])
            counters[ReactComponent.name] = 0

        const counter = counters[ReactComponent.name]

        const newItem = <ReactComponent key={String(ReactComponent.name) + counter} id={String(ReactComponent.name) + counter} {...props} />
        counters[ReactComponent.name] += 1
        itemList.push(newItem)
       
        this.setState({
            itemList,
            counters
        })
    }

    onVideosetElementAdded = async (element) => {
        let ReactComponentName, props
        switch (element) {
            case 'Slider':
                ReactComponentName = PictureSlider
                const slider = await this.webStorageService.postSlider(this.props.id)
                props = { id: slider.id, editable: true, uploadingPicture: this.uploadingPicture, deletingPicture: this.deletingPicture }
                break

            case 'Description':
                ReactComponentName = VideosetDescription
                props = { text: "", editable: true, saveDescription: this.saveDescription }
                break

            case 'Videos':
                ReactComponentName = VideosContainer
                const videosContainer = await this.webStorageService.postVideosContainer(this.props.id)
                const videos = await this.webStorageService.getVideosOfVideosContainer(videosContainer.id)
                props = { id: videosContainer.id, videos, updateContainer:this.updateContainer,uploadingURLVideo:this.uploadingURLVideo, uploadingVideo: this.uploadingVideo, onVideoClick: this.onVideoClick, editable: true }
                break

            default: return
        }

        this.addItemToColumn(ReactComponentName, props)
        const { added, itemList } = this.state
        added.push(itemList[itemList.length - 1])
    }

    uploadingVideo = async (id, video) => {
        
        const name = prompt("Input video name: ", "Video")
        const res = await this.webStorageService.postVideo(id, name, video)
        if (!res.ok) {
            return
        }
    }

    uploadingURLVideo =  (id,name, url) => {
        this.webStorageService.postURLVideo(id,name, url).then(()=>{
            this.updateContainer(id)
        })
    }


    updateContainer = async (id) => {
        
        const {itemList} = this.state
        const videos = await this.webStorageService.getVideosOfVideosContainer(id)
        
        const indexOfElement = itemList.findIndex((item) => item.props.id === id);
        const newProps = {...itemList[indexOfElement].props,videos}
        itemList.splice(indexOfElement,1)
        this.setState({itemList})

        
        
        this.addItemToColumn(VideosContainer,newProps)
        const {itemList:itemList1} = this.state
        const newItem = itemList1.pop()
        itemList1.splice(indexOfElement,0,newItem)
        this.setState({itemList:itemList1})
    }

    onVideoClick = async (video) => {
        let {videoPlayer, showModal} = video
        const { source, id } = video

        if (source === 'local') {
            videoPlayer = <VideoPlayer video={video} url={`${this.webStorageService._apiBase}/video/${id}`} />
            showModal=true
        }
        else {
            const videoURL = new Url(video.file)
            if(videoURL.hostname === 'www.youtube.com'){
                console.log(videoURL.hostname)
                videoPlayer = <VideoPlayer video={video} url={video.file} />
                showModal=true
            }
            else {
                window.open(video.file);
                showModal=false
            }
        }
        this.setState({ videoPlayer, showModal })
        
    }

    onVideosetItemDeleted = async (id) => {
        const { itemList, deleted } = this.state
        const index = itemList.indexOf(itemList.find((item) => item.props.id === id))
        deleted.push(itemList.splice(index, 1)[0])

        this.setState({ itemList, deleted })
        
    }

    saveDescription = (id, text) => {
        const { itemList, counters } = this.state
        const index = itemList.indexOf(itemList.find((item) => item.props.id === id))
        const key = String(VideosetDescription.name) + counters[VideosetDescription.name]++
        itemList[index] = <VideosetDescription editable key={key} id={key} text={text} saveDescription={this.saveDescription} />
        this.setState({ itemList, counters })
    }

    saveChanges = async () => {
        const { data, itemList, deleted } = this.state
       
        const order = []
        console.log(itemList)
        for(let i=0;i<itemList.length;i++){
            const item = itemList[i]
            const newItem = { type: item.type.name }
            switch (item.type.name) {
                case 'PictureSlider':
                case 'VideosContainer':
                    newItem.value = item.props.id
                    break

                case 'VideosetDescription':
                    newItem.value = item.props.text
                    break

                default: return
            }
            order.push(newItem)
        }
        data.order = order
        console.log(order)
        await this.webStorageService.patchVideoset(this.props.id, { order, name:data.name, owner:data.owner })

        
        if (deleted.length !== 0) {
            
            for (let i = 0; i < deleted.length; i++) {
                if (deleted[i].type.name === 'PictureSlider') {
                    await this.webStorageService.deleteSlider(deleted[i].props.id)
                }
                else if (deleted[i].type.name === 'VideosContainer') {
                    await this.webStorageService.deleteVideosContainer(deleted[i].props.id)
                }
            }
        }


        this.setState({ data, deleted: [] })
    }

    cancelAction = async () => {
        const { startData, added } = this.state
        for (let i = 0; i < added.length; i++) {
            if (added[i].type.name === 'PictureSlider') {
                await this.webStorageService.deleteSlider(added[i].props.id)
            }
        }
        this.setState({ data: startData, added: [], itemList: [] })
        this.initialAddingItems()
    }

    changeTitle = () => {
        const {data} = this.state
        const newTitle = prompt("Input new title", data.name)
        if (newTitle && newTitle !== '') {
            data.name = newTitle
            this.setState(data)
        }
    }

    changeLogo = async (logo) => {
        await this.webStorageService.postLogo(this.state.data.id, logo)
    }

    changeSubcategory = (id) => {
        const {data} = this.state
        data.owner = id
        this.setState({data})
    }
    
    deleteVideoset = async () => {
        await this.webStorageService.deleteVideoset(this.state.data.id)
    }

    render() {
        const { data, columnId, itemList, videoPlayer, showModal } = this.state

        if (!data)
            return null
        const { name } = data

        const deleteVideoButton = (<button type="button" className="btn btn-outline-danger" onClick={() => this.deletingVideo(videoPlayer.props.video)}>Delete video</button>)
        const videoPlayerModal = (showModal) ? (
            <Modal className="video-modal" footer={deleteVideoButton} onClose={() => this.setState({ showModal: false })} show={showModal} title={videoPlayer.props.video.name}>
                {videoPlayer}
            </Modal>
        ) : null

        return (
            <div className="videoset">
                {videoPlayerModal}

                <h1 className=" videoset-title">
                    {name}
                </h1>

                <EditorBar changeLogo={this.changeLogo} id={data.id} videoset={data} changeSubcategory={this.changeSubcategory} deleteVideoset={this.deleteVideoset} changeTitle={this.changeTitle} onVideosetElementAdded={this.onVideosetElementAdded} saveChanges={this.saveChanges} cancelAction={this.cancelAction} />
                <EditorContext onDragEnd={this.onDragEnd}>
                    <VerticalColumn id={columnId} items={itemList} onItemDeleted={this.onVideosetItemDeleted} />
                </EditorContext>

            </div>
        )
    }

}
