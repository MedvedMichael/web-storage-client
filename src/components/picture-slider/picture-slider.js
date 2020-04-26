import React, { Component } from 'react';
import WebStorageService from '../../services/web-storage-service';

export default class PictureSlider extends Component {

    webStorageService = new WebStorageService()

    state = {
        slideIndex:0,
        slides:null
    }

    componentDidMount(){
        const {dataURLs} = this.props
        const slides = dataURLs.map(path => {
            return (<SlideView key={path} path={path} />)
        });
        
        this.setState({slides})
    
    }

    changeSlideIndex = (number) => {
        const {slides, slideIndex} = this.state
        const currentSlideIndex = slideIndex
        let newSlideIndex = currentSlideIndex + number

        if (newSlideIndex >= slides.length)
            newSlideIndex -= slides.length

        if (newSlideIndex < 0)
            newSlideIndex += slides.length


        this.setState({slideIndex:newSlideIndex})
    }

    onPrevButtonClick = () =>{
        this.changeSlideIndex(-1)
    }

    onNextButtonClick = () =>{
        this.changeSlideIndex(1)
    }

    updateSlides = () =>{
         
    }

    render() {
        const {slides} = this.state
        if(!slides)
        return null;
        const dots = slides.map(element => {
            return <DotView/>
        });
        return (
             <div className="container">
                 {this.state.slides}
             </div>
        );
    }
}

const SlideView = ({path}) => {
    return(
        <img src={path} alt="slider"/>
    )
}

const DotView = ({isSelected}) => {
    
    return (
        <div className="dot"></div>
    )
}