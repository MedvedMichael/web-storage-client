import React, { Component } from 'react';
import WebStorageService from '../../services/web-storage-service';
import './picture-slider.css'
import Spinner from '../spinner/spinner';
export default class PictureSlider extends Component {

    webStorageService = new WebStorageService()

    state = {
        slides: null,
        slideIndex:null,
        currentSlide:null
    }

    componentDidMount() {
        const { dataURLs } = this.props
        if(!dataURLs)
            return
        const slides = dataURLs.map((path) => {
            return (<SlideView key={path} path={path} />)
        });
        this.setState({ slides, slideIndex:0})
        
    }

    changeSlideIndex = (number) => {
        const { slides, slideIndex } = this.state
        const currentSlideIndex = slideIndex
        let newSlideIndex = currentSlideIndex + number

        if (newSlideIndex >= slides.length)
            newSlideIndex -= slides.length

        if (newSlideIndex < 0)
            newSlideIndex += slides.length

        
        this.setState({ slideIndex: newSlideIndex })
    }

    onPrevButtonClick = () => {
        this.changeSlideIndex(-1)
    }

    onNextButtonClick = () => {
        this.changeSlideIndex(1)
    }

    onDotClick = (index) => {
        const {slideIndex} = this.state
        this.changeSlideIndex(index - slideIndex)
    }


    render() {
        const { slides, slideIndex } = this.state
        if (!slides)
            return <h3 className="error-message">There's no content</h3>;

        if(!slides[slideIndex])
            return <Spinner />
        
        const currentSlide = slides[slideIndex];
        const dots = slides.map((element,index) => {
            const isActive = index === slideIndex
            return <DotView isActive={isActive} id={index} onClick={this.onDotClick} key={"dot" + index}/>
        });

        return (
            <div className="content">
                <div className="slider">
                    <div className="wrap">
                        {currentSlide}
                        <div className="prev" onClick={this.onPrevButtonClick}>
                            <div className="arrow-left"></div>
                        </div>
                        <div className="next" onClick={this.onNextButtonClick}>
                            <div className="arrow-right"></div>
                        </div>
                    </div>
                    <div className="slider-dots">
                        {dots}
                    </div>

                </div>
            </div>
        );
    }
}

const SlideView = ({ path }) => {

    return (
        <div className="slider-item">
            <img src={path} alt="slider" />
        </div>
    )
}

const DotView = ({ isActive, id, onClick }) => {
    const className = "dot" + (isActive?" dot-active":"")
    return (
        <div className={className} onClick={()=>onClick(id)}></div>
    )
}