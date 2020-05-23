import React, { Component } from 'react';
import './editor-bar.css'
class EditorBar extends Component {

    state = {
        isDropdownMenuOpened: false,
        videosetItems: {
            PictureSlider: 'Slider',
            VideosetDescription: 'Description',
            Videos: 'Videos'
        }
    }


    onDropdownMenuClick = () => {
        const { isDropdownMenuOpened } = this.state
        const newStatus = !isDropdownMenuOpened;
        this.setState({ isDropdownMenuOpened: newStatus })
    }

    onDropdownItemClick = (element) => {
        this.props.onVideosetElementAdded(element)
        this.onDropdownMenuClick()
    }

    onSaveChangesButtonClick = () => {
        this.props.saveChanges()
    }
    onCancelButtonClick = () => {
        this.props.cancelAction()
    }

    render() {

        const { isDropdownMenuOpened, videosetItems } = this.state
        const dropdownMenuStyle = `dropdown-menu ${isDropdownMenuOpened ? 'show' : ''}`


        const dropdownElements = Object.values(videosetItems).map((element) =>
            (<div key={`add ${element}`}>
                <span className="dropdown-item" onClick={() => this.onDropdownItemClick(element)}>{element}</span>
            </div>))

        return (
            <div className="editor-bar-container">
                <div className="card editor-bar">
                    <ul className="nav nav-pills">
                        <li className="nav-item dropdown add-dropdown">
                            <h4 className="nav-link dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"
                                onClick={() => this.onDropdownMenuClick()}>Add item</h4>
                            <div className={dropdownMenuStyle} x-placement="bottom-start">
                                {dropdownElements}
                            </div>
                        </li>
                        <li className="nav-item editor-bar-buttons">
                            <div className="btn-group">
                                <button className="btn btn-outline-success" onClick={this.onSaveChangesButtonClick}>Save changes</button>
                                <button className="btn btn-outline-danger" onClick={this.onCancelButtonClick}>Cancel</button>
                            </div>
                        </li>

                    </ul>
                </div>
            </div>
        )
    }
}



export default EditorBar