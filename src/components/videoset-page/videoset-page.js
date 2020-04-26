import React, { Component } from 'react';
import Spinner from '../spinner';
import PictureSlider from '../picture-slider/picture-slider';

export default class VideosetPage extends Component{

    
    render(){
        return(
            <div>
                <PictureSlider 
                dataURLs={['https://s3.tproger.ru/uploads/2017/04/11-js-tricks-880x308.png',
                           'https://tech-geek.ru/wp-content/uploads/javascript-security.jpg',
                           'https://techrocks.ru/wp-content/uploads/2017/11/JS_answers_1.jpg']}/>
            </div>
        )
    }
}