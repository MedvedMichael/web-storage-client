import React from 'react';

const VideoPlayer = ({ url }) => {
    return (
        <div className="video-player">
            <div className="card">
                <div className="thumb-wrap">
                    <iframe title={url} width="560" height="315" src={url} frameBorder="0" allowFullScreen></iframe>
                </div>
            </div>
            <div id="grey"></div>
        </div>)
}

export default VideoPlayer