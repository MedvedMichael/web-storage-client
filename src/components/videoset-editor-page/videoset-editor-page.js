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
import Modal from '../modal/modal';
import FileDropWrapper from '../file-drop-wrapper/file-drop-wrapper';

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
        // const movedItem = data.order.splice(source.index,1)[0]
        // data.order.splice(destination.index,0,movedItem)
        this.setState({ itemList })
        // console.log(data.order)
        // const updating  = await this.webStorageService.patchVideoset(this.props.id,{order:data.order})
        // console.log(updating)

    }

    async componentDidMount() {
        const { id } = this.props
        const { getVideoset, getSubcategory } = this.webStorageService
        const videosetData = await getVideoset(id)
        const subcategoryData = await getSubcategory(videosetData.owner)
        this.setState({ videosetId: id, data: videosetData, startData: videosetData, subcategoryData })


        console.log(videosetData)
        this.initialAddingItems()
        // console.log(subcategoryData)
        // const pictures = [
        //     'https://s3.tproger.ru/uploads/2017/04/11-js-tricks-880x308.png',
        //     'https://tech-geek.ru/wp-content/uploads/javascript-security.jpg',
        //     'https://techrocks.ru/wp-content/uploads/2017/11/JS_answers_1.jpg']


        // this.addItemToColumn(PictureSlider, { dataURLs: pictures, editable:true, uploadingPictures:this.uploadingPictures })
        // this.addItemToColumn(VideosetDescription,{text:"If you were using 0.x versions: library was significantly rewritten for 1.x version and contains several breaking changes. The best way to upgrade is to read the docs and follow the examples.\n\nPlease note that the default footer parses HTML automatically (such as <b>I'm bold!</b>) but it does not implement any form of XSS or sanitisation. You should do that yourself before passing it into the caption field of react-images. \n Using the Carousel\n\nImport the carousel from react-images at the top of a component and then use it in the render function."})
        // this.addItemToColumn(Spinner)
        // this.addItemToColumn(VideoPlayer,{url:"https://www.youtube.com/embed/gCmVQdWKF0A"})

    }

    initialAddingItems = async () => {

        const { data } = this.state
        const { order } = data
        // data.order = []
        // this.setState({data})

        for (let i = 0; i < order.length; i++) {
            const element = order[i]
            console.log("KUKU")
            if (element.type === 'VideosetDescription' && element.value !== null) {
                this.addItemToColumn(VideosetDescription, { text: element.value, editable: true })
            }
            else if (element.type === 'PictureSlider' && element.value) {
                const dataURLs = await this.webStorageService.getPicturesOfSlider(element.value)
                
                this.addItemToColumn(PictureSlider, { id: element.value, dataURLs, editable: true, uploadingPicture: this.uploadingPicture, deletingPicture: this.deletingPicture })
            }

            else if (element.type === 'VideosContainer' && element.value) {
                const videos = await this.webStorageService.getVideosOfVideosContainer(element.value)
                await this.addItemToColumn(VideosContainer, { id: element.value, videos, updateContainer:this.updateContainer, editable: true, onVideoClick: this.onVideoClick, uploadingVideo: this.uploadingVideo })
            }
        }

    }

    uploadingPicture = async (id, slideIndex, picture) => {
        const res = await this.webStorageService.postPicture(id, picture)
        if (!res.ok) {
            console.log(res)
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

        await this.updateVideoContainer(owner)
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
        // console.log(newList)
        // data.order.push(ReactComponent.name)

        // data.order = []
        this.setState({
            itemList,
            counters
        })

        // const updating  = await this.webStorageService.patchVideoset(this.props.id,{order:data.order})

        // console.log(updating)

    }

    onVideosetElementAdded = async (element) => {
        let ReactComponentName, props
        switch (element) {
            case 'Slider':
                ReactComponentName = PictureSlider
                const slider = await this.webStorageService.postSlider(this.props.id)
                console.log(slider)
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
                props = { id: videosContainer.id, videos, updateContainer:this.updateContainer, uploadingVideo: this.uploadingVideo, onVideoClick: this.onVideoClick, editable: true }
                break

            default: return
        }

        this.addItemToColumn(ReactComponentName, props)
        const { added, itemList } = this.state
        added.push(itemList[itemList.length - 1])
    }

    uploadingVideo = async (id, video) => {
        console.log('KUKU')
        const name = prompt("Input video name: ", "Video")
        const res = await this.webStorageService.postVideo(id, name, video)
        if (!res.ok) {
            console.log(res)
            return
        }
        // await this.updateVideoContainer(id)
        // const dataURLs = await this.webStorageService.getPicturesOfSlider(this.props.id)
        // this.updateSlider(id, slideIndex)
    }

    updateContainer = async (id) => {
        await this.updateVideoContainer(id)
    }

    updateVideoContainer = async (id) => {
        
        const {itemList} = this.state
        const videos = await this.webStorageService.getVideosOfVideosContainer(id)
        console.log(videos)
        const indexOfElement = itemList.findIndex((item) => item.props.id === id);
        const newProps = {...itemList[indexOfElement].props,videos}
        itemList.splice(indexOfElement,1)
        this.setState({itemList})

        console.log(newProps)
        // const newVideoContainer = <VideosContainer {...newProps} />
        this.addItemToColumn(VideosContainer,newProps)
        const {itemList:itemList1} = this.state
        const newItem = itemList1.pop()
        itemList1.splice(indexOfElement,0,newItem)
        this.setState({itemList:itemList1})
        // itemList.push(newVideoContainer);
        // const newItemList = [...itemList.slice(0,indexOfElement),newVideoContainer,...itemList.slice(indexOfElement+1)]
        // this.setState({ itemList:newItemList, showModal:false })
        // console.log(this.state.itemList)
    }

    onVideoClick = async (video) => {
        let videoPlayer
        const { source, id } = video

        if (source === 'local') {
            videoPlayer = <VideoPlayer video={video} url={`${this.webStorageService._apiBase}/video/${id}`} />
        }
        else {
            const videoURL = await this.webStorageService.getResourse(`/video/${id}`)
            videoPlayer = <VideoPlayer video={video} url={videoURL} />
        }
        this.setState({ videoPlayer, showModal: true })
        console.log(videoPlayer)
        console.log(id)
    }

    onVideosetItemDeleted = async (id) => {
        const { itemList, deleted } = this.state
        const index = itemList.indexOf(itemList.find((item) => item.props.id === id))
        deleted.push(itemList.splice(index, 1)[0])

        // data.order.splice(index,1);
        this.setState({ itemList, deleted })
        // await this.webStorageService.patchVideoset(this.props.id,{order:data.order})
        // console.log(data.order)
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
        // const {order} = data

        const order = []
        itemList.forEach(item => {
            console.log(item)
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
        })
        data.order = order
        const updating = await this.webStorageService.patchVideoset(this.props.id, { order, name:data.name })

        console.log(deleted)
        if (deleted.length !== 0) {
            console.log(deleted)
            for (let i = 0; i < deleted.length; i++) {
                if (deleted[i].type.name === 'PictureSlider') {
                    const deleting = await this.webStorageService.deleteSlider(deleted[i].props.id)
                    console.log(deleting)
                }
                else if (deleted[i].type.name === 'VideosContainer') {
                    const deleting = await this.webStorageService.deleteVideosContainer(deleted[i].props.id)
                    console.log(deleting)
                }
            }
        }


        this.setState({ data, deleted: [] })
        console.log(updating)
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
        data.name = newTitle
        this.setState(data)
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

        // const videoUploadingModal = (showVideoUploadingModal) ?(
        //     <Modal onClose={()=>this.setState({showVideoUploadingModal:false})} title="Uploading video">
        //     <FileDropWrapper editable onFilesAdded={o}>
                  
        //     </FileDropWrapper>
        //     </Modal>
        // ):null

        console.log(itemList)

        return (
            <div className="videoset">
                {videoPlayerModal}

                <h1 className=" videoset-title">
                    {name}
                </h1>

                <EditorBar id={data.id} deleteVideoset={this.deleteVideoset} changeTitle={this.changeTitle} onVideosetElementAdded={this.onVideosetElementAdded} saveChanges={this.saveChanges} cancelAction={this.cancelAction} />
                <EditorContext onDragEnd={this.onDragEnd}>
                    <VerticalColumn id={columnId} items={itemList} onItemDeleted={this.onVideosetItemDeleted} />
                </EditorContext>

            </div>
        )
    }

}
