import React, { Component } from 'react';
import WebStorageService from '../../services/web-storage-service';
import VideosetDescription from '../videoset-description/videoset-description';
import PictureSlider from '../picture-slider/picture-slider';
import WrapperCard from '../wrapper-card/wrapper-card'

export default class VideosetPage extends Component {

    webStorageService = new WebStorageService()
    state = {
        data:null
    }

    componentDidMount = async () => {
        const { id } = this.props
        const videoset = await this.webStorageService.getVideoset(id)

        this.setState({ data: videoset })
    }


    render() {
        if(!this.state.data){
        return <div></div>
        }
        const { order, name, description } = this.state.data
        const pageItems = []
        order.forEach((item, index)=>{
            if(item === 'VideosetDescription'){
                pageItems.push(
                <WrapperCard key={item + '' + index}>
                   <VideosetDescription text={description}/>
                </WrapperCard>)
            }
            else if(item === 'Slider'){
                pageItems.push(<PictureSlider/>)
            }
        })


        return (
            <div>
                <h1 className="videoset-title">
                    {name}
                </h1>
                {pageItems}
            </div>)
    }


}