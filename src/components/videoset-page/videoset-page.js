import React, { Component } from 'react';
import Spinner from '../spinner';
import PictureSlider from '../picture-slider/picture-slider';
import WebStorageService from '../../services/web-storage-service';
import './videoset-page.css'
export default class VideosetPage extends Component{

    webStorageService = new WebStorageService()

    state = {
        data:null
    }

    componentDidMount(){
        const {id, getData} = this.props
        getData(id).then((data) => {
            this.setState({data})
        }).catch((err) => {
            console.log(err)
        });

        
    }

    render(){
        const {data} = this.state
        if (!data)
            return null
        const { name, description } = this.state.data

        return (
            <div className="videoset">
                <h1 className="videoset-title">
                    {name}
                </h1>
                <PictureSlider
                    dataURLs={['https://s3.tproger.ru/uploads/2017/04/11-js-tricks-880x308.png',
                        'https://tech-geek.ru/wp-content/uploads/javascript-security.jpg',
                        'https://techrocks.ru/wp-content/uploads/2017/11/JS_answers_1.jpg']} />

            </div>
        )
    }
}