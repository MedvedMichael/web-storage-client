import React, { Component } from 'react';
import './editor-bar.css'
class EditorBar extends Component {

state = {
    isDropdownMenuOpened:false,
    videosetItems: {
        PictureSlider:'Slider',
        VideosetDescription:'Description', 
        Videos:'Videos'}
}


onDropdownMenuClick = () => {
    const {isDropdownMenuOpened} = this.state
    const newStatus = !isDropdownMenuOpened;
    this.setState({ isDropdownMenuOpened: newStatus }) 
}

onDropdownItemClick = (element) => {
    this.props.onVideosetElementAdded(element)
    this.onDropdownMenuClick()
}

    render() {

        const {isDropdownMenuOpened,videosetItems} = this.state
        const dropdownMenuStyle = `dropdown-menu ${isDropdownMenuOpened?'show':''}`

        
        const dropdownElements = Object.values(videosetItems).map((element)=>
        (<div key={`add ${element}`}>
            <span className="dropdown-item" onClick={()=>this.onDropdownItemClick(element)}>{element}</span>
        </div>))

        return (
            <div className="editor-bar-container container">
                <div className="card editor-bar">
                    <div className="nav-item dropdown">
                        <span className="nav-link dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"
                            onClick={() => this.onDropdownMenuClick()}>Add item</span>
                        <div className={dropdownMenuStyle} x-placement="bottom-start">
                            {dropdownElements}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}



export default EditorBar