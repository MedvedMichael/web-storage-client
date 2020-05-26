import React, { Component } from 'react';
// import WebStorageService from '../../services/web-storage-service';
import './picture-slider.css'
import Spinner from '../spinner/spinner';
import FileDropWrapper from '../file-drop-wrapper/file-drop-wrapper';
export default class PictureSlider extends Component {

    state = {
        slides: null,
        slideIndex: null,
        editable: false
    }


    componentDidMount() {
        // const { dataURLs, editable } = this.props
        // const slides = (dataURLs)? dataURLs.map((path) => {
        //     return (<SlideView key={path} path={path} />)
        // }):null 
        // this.setState({ slides, slideIndex: 0, editable: (editable) ? editable : false })
        this.initSlides()

    }

    initSlides = () => {
        const { dataURLs, editable, slideIndex } = this.props


        const slides = (dataURLs) ? dataURLs.map((path) => {
            const img = document.createElement('img');
            img.src = path;
            return (<SlideView key={path} path={path} />)
        }) : null
        this.setState({ slides, slideIndex: (slideIndex && slideIndex >= 0) ? slideIndex : 0, editable: (editable) ? editable : false })
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
        const { slideIndex } = this.state
        this.changeSlideIndex(index - slideIndex)
    }

    onPictureAdded = async ({ files }) => {
        // console.log(files[0])
        const { uploadingPicture } = this.props
        for (let i = 0; i < files.length; i++)
            await uploadingPicture(this.props.id, this.state.slideIndex, files[i])
    }

    onPictureDeleted = () => {
        const { slides, slideIndex } = this.state
        const slide = slides[slideIndex]
        this.props.deletingPicture(this.props.id, slideIndex, slide.props.path)

    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.dataURLs !== this.props.dataURLs) {
            this.initSlides()
        }
    }

    render() {
        const { slides, slideIndex, editable } = this.state

        const addPictureButton = (editable) ? (
            <div>
                <label htmlFor="file-upload" className="btn btn-outline-success custom-file">
                    Upload pictures
                </label>
                <input multiple="multiple" onChange={({ target }) => this.onPictureAdded(target)} id="file-upload" type="file" className="custom-file-input" />
            </div>
        ) : null
        // console.log(editable)
        if (!slides || slides.length === 0)
            return (
                <FileDropWrapper editable onFilesAdded={this.onPictureAdded}>
                    <h3 className="error-message">There's no content</h3>
                    <div className="add-delete-btn-container">
                        <div className="add-delete-btn-group btn-group">
                            {addPictureButton}
                        </div>
                    </div>
                </FileDropWrapper>);


        if (!slides[slideIndex])
            return <Spinner />

        const currentSlide = slides[slideIndex];
        const dots = slides.map((element, index) => {
            const isActive = index === slideIndex
            return <DotView isActive={isActive} id={index} onClick={this.onDotClick} key={"dot" + index} />
        });

        const addAndDeleteButtonGroup = (editable) ? (
            <div className="add-delete-btn-container">
                <div className="add-delete-btn-group btn-group">
                    {addPictureButton}
                    <button type="button" className="btn btn-outline-danger" onClick={() => this.onPictureDeleted()}>Delete picture</button>
                </div>
            </div>) : null




        return (
            <div className="content">
                <FileDropWrapper editable={editable} onFilesAdded={this.onPictureAdded}>
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
                        {addAndDeleteButtonGroup}

                    </div>
                </FileDropWrapper>
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
    const className = "dot" + (isActive ? " dot-active" : "")
    return (
        <div className={className} onClick={() => onClick(id)}></div>
    )
}