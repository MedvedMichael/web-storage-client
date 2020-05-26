import React, { Component } from 'react';
import WebStorageService from '../../services/web-storage-service';
import VideosetDescription from '../videoset-description/videoset-description';
import VideosContainer from '../videos-container/videos-container'
import PictureSlider from '../picture-slider/picture-slider';
import WrapperCard from '../wrapper-card/wrapper-card'
import VideoPlayer from '../video-player/video-player';
import Modal from '../modal/modal';

import './videoset-page.css'
import { useHistory } from 'react-router-dom';

export default class VideosetPage extends Component {

    webStorageService = new WebStorageService()
    state = {
        data:null,
        showModal:false,
        videoPlayer:null,
        itemList:[],
        counters:{

        }
    }

    componentDidMount = async () => {
        const { id } = this.props
        const videoset = await this.webStorageService.getVideoset(id)

        this.setState({ data: videoset })
        this.initialAddingItems()
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
                await this.addItemToColumn(VideosetDescription, { text: element.value })
            }
            else if (element.type === 'PictureSlider' && element.value) {
                const dataURLs = await this.webStorageService.getPicturesOfSlider(element.value)
                await this.addItemToColumn(PictureSlider, { id: element.value, dataURLs})
            }

            else if (element.type === 'VideosContainer' && element.value) {
                const videos = await this.webStorageService.getVideosOfVideosContainer(element.value)
                await this.addItemToColumn(VideosContainer, { id: element.value, videos,onVideoClick: this.onVideoClick })
            }
        }

    }

    addItemToColumn = async (ReactComponent, props = {}) => {
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



    render() {
        if(!this.state.data){
        return <div></div>
        }
        const { data,itemList, showModal, videoPlayer } = this.state
        const {name} = data
        const pageItems =  itemList.map((item, index)=>
                <WrapperCard key={item + '' + index}>
                   {item}
                </WrapperCard>)
        const videoPlayerModal = (showModal) ? (
            <Modal className="video-modal" onClose={() => this.setState({ showModal: false })} show={showModal} title={videoPlayer.props.video.name}>
                {videoPlayer}
            </Modal>
        ) : null

        const EditPageButton = ({id}) => {
            const history = useHistory()
            const onClick = () => {
                // history.goBack()
                // history.goBack()
                history.push(`/edit-videoset/${id}`)
            }
            return (
                <div style={{ display: 'flex' }}>
                    <button onClick={onClick} type="button" className="edit-btn btn btn-lg btn-secondary" data-dismiss="modal" >Edit this page</button>
                </div>
            )
        }
        

        const userString = localStorage.getItem('user')
        const user = (userString!=='')?JSON.parse(userString):null;
        return (
            <div className="videoset">
                {videoPlayerModal}
                {(user && user.status.endsWith('admin')) ? <EditPageButton id={data.id} /> : null}
                <h1 className="videoset-title">
                    {name}
                </h1>
                {pageItems}
            </div>)
    }


}
