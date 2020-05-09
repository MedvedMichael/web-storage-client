import React from 'react';
import './videoset-description.css'
const VideosetDescription = ({ text }) => {
    const title = <h3>Description: </h3>
    const description = (
        <div className="card-body">
            <span>{text}</span>
        </div>)

    
    return (
    <div className="videoset-description">
        <Row left={title} right={description}/>
    </div>)
}
const Row = ({ left, right }) => {
    const width = `row-item`;
    return (
        <div className="row mb2">
            <div className={width}>
                {left}
            </div>
            <div className="col-md-9">
                {right}
            </div>
        </div>
    )
}

export default VideosetDescription