import React, { Component } from 'react';
import './editor-bar.css'
import { useHistory } from 'react-router-dom';
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

    onSaveChangesButtonClick = async () => {
        await this.props.saveChanges()
    }
    onCancelButtonClick = () => {
        this.props.cancelAction()
    }

    onChangeTitleButtonClick = () => {
        this.props.changeTitle()
    }

    onDeleteVideosetClickButton = async () => {
        await this.props.deleteVideoset()
    }

    render() {

        const { isDropdownMenuOpened, videosetItems } = this.state
        const dropdownMenuStyle = `dropdown-menu ${isDropdownMenuOpened ? 'show' : ''}`

        const SaveChangesButton = ({ id,onClick }) => {
            const history = useHistory()
            const onThisClick = async () => {
                await onClick()
                history.push(`/videosets/${id}`)
            }
            return (<button className="btn btn-outline-success" onClick={onThisClick}>Save changes</button>)
        }

        const DeleteVideosetButton = ({onClick})=> {
            const history = useHistory()
            const onThisClick = async () => {
                await onClick()
                history.push(`/`)
            }
            return (<button className="change-title btn btn-danger" onClick={onThisClick}>Delete videoset</button>)
        }

        const saveChanges = (<SaveChangesButton id={this.props.id} onClick={async()=>await this.onSaveChangesButtonClick()}/>)
        const dropdownElements = Object.values(videosetItems).map((element) =>
            (<div key={`add ${element}`}>
                <span className="dropdown-item" onClick={() => this.onDropdownItemClick(element)}>{element}</span>
            </div>))
        const changeTitle = <button type="button" className="change-title btn btn-primary" onClick={this.onChangeTitleButtonClick}>Change title</button>
        
        const deleteVideosetButton = <DeleteVideosetButton id={this.props.id} onClick={async()=>await this.onDeleteVideosetClickButton()}/>
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
                        <li>
                            <div className="btn-group">
                                {changeTitle}
                                {deleteVideosetButton}
                            </div>
                        </li>
                        <li className="nav-item editor-bar-buttons">
                            <div className="btn-group">
                                {saveChanges}
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