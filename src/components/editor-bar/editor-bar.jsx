import React, { Component } from 'react';
import './editor-bar.css'
import { useHistory } from 'react-router-dom';
import WebStorageService from '../../services/web-storage-service';
class EditorBar extends Component {

    webStorageService = new WebStorageService()

    state = {
        isDropdownMenuOpened: false,
        videosetItems: {
            PictureSlider: 'Slider',
            VideosetDescription: 'Description',
            Videos: 'Videos'
        },
        isDropdownSubcategoryMenuOpened:false,
        subcategories:[],
        videoset:null
    }

    componentDidMount = async() => {
        const {videoset} = this.props
        const subcategories = await this.webStorageService.getAllSubcategories()
        this.setState({subcategories,videoset})
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

    onDropdownSubcategoryMenuClick = () => {
        const { isDropdownSubcategoryMenuOpened } = this.state
        const newStatus = !isDropdownSubcategoryMenuOpened;
        this.setState({ isDropdownSubcategoryMenuOpened: newStatus })
    }

    onSubcategoryItemClick = async (id) => {
        await this.props.changeSubcategory(id)
        this.onDropdownSubcategoryMenuClick()
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

    onChangeLogoButtonClick = async ({files}) => {
        console.log('KU')
        await this.props.changeLogo(files[0])
        const { videoset } = this.state
        videoset.hasLogo = true
        this.setState({videoset})
    }

    onDeleteLogoButtonClick = async () => {
        await this.webStorageService.deleteLogo(this.state.videoset.id)
        const { videoset } = this.state
        videoset.hasLogo = false
        this.setState({videoset})
    }

    render() {

        const { isDropdownMenuOpened, isDropdownSubcategoryMenuOpened, videosetItems, subcategories, videoset } = this.state
        const dropdownMenuStyle = `dropdown-menu ${isDropdownMenuOpened ? 'show' : ''}`
        const dropdownSubcategoryMenuStyle = `dropdown-menu ${isDropdownSubcategoryMenuOpened ? 'show' : ''}`
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
                <span className={`dropdown-item`} onClick={() => this.onDropdownItemClick(element)}>{element}</span>
            </div>))

        const currentSubcategory = (subcategories) ? subcategories.find(({ id }) => videoset.owner === id) : 0
        
        const subcategoriesViews = (subcategories) ? subcategories.filter(subcategory => subcategory.owner === currentSubcategory.owner)
        .map(({id, name})=> {
            
            return (<div key={`add ${id}`}>
                <span className={`dropdown-item ${videoset.owner === id ? 'text-info' : ''}`} onClick={() => this.onSubcategoryItemClick(id)}>{name}</span>
            </div>
        )}):null
        const changeTitle = <button type="button" className="change-title btn btn-primary" onClick={this.onChangeTitleButtonClick}>Change title</button>

        const changeLogo = (
            <div className="change-title">
                <label htmlFor="logo-upload" className="btn btn-warning custom-file">Upload logo</label>
                <input onChange={({ target }) => this.onChangeLogoButtonClick(target)} id="logo-upload" type="file" className="custom-file-input" />
            </div>)

        const deleteLogo = (<button type="button" className="change-title btn btn-danger" onClick={this.onDeleteLogoButtonClick}>Delete logo</button>)
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
                                {changeLogo}
                                {(videoset && videoset.hasLogo)?deleteLogo:null}
                                {changeTitle}
                                {deleteVideosetButton}
                            </div>
                        </li>
                        <li className="nav-item dropdown add-dropdown">
                            <h4 className="nav-link dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"
                                onClick={() => this.onDropdownSubcategoryMenuClick()}>Select subcategory</h4>
                            <div className={dropdownSubcategoryMenuStyle} x-placement="bottom-start">
                                {subcategoriesViews}
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