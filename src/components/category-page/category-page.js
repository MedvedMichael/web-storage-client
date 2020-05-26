
import React, { Component } from 'react';
import { Link, useHistory } from 'react-router-dom'
import WebStorageService from '../../services/web-storage-service'
import ItemList from '../item-list/item-list'
import './category-page.css'
export default class CategoryPage extends Component {

    webStorageService = new WebStorageService()

    state = {
        selectedCategory: null,
        selectedSubcategory: null,
        categories:null,
        subcategories:null,
        videosets:null
    }

    componentDidMount = async () => {
        await this.updateCategories()
    }

    onCategorySelected = async (selectedCategory) => {
        await this.updateSubcategories(selectedCategory)
    }

    onSubcategorySelected = async (selectedSubcategory) => {
        await this.updateVideosets(selectedSubcategory)
    }

    renderVideosets = (videosets) => {
        const videosetsCards = videosets.map((props,index) => {
            const key = `VideosetCard-${index}`
            return (
                <VideosetCard key={key} {...props}/>
            )
        })
        return (
            <div className="videosets-container container">
                {videosetsCards}
            </div>
        )
    }

    addCategory = async () => {
        const name = prompt('Input name of category', '')
        await this.webStorageService.postCategory(name)
        await this.updateCategories()
    }

    addSubcategory = async () => {
        const name = prompt('Input name of category', '')
        await this.webStorageService.postSubcategory(name, 'text', this.state.selectedCategory.id)
        await this.updateSubcategories(this.state.selectedCategory)
    }

    

    deleteCategory = async () => {
        this.setState({selectedCategory:null,selectedSubcategory:null})
        //TODO
        await this.updateCategories()
    }


    updateCategories = async () => {
        const categories = await this.webStorageService.getAllCategories()
        // console.log(categories)
        this.setState({categories})
        // console.log(categories)
    }

    updateSubcategories = async (selectedCategory) => {
        // const {selectedCategory} = this.state

        if (!selectedCategory)
            return;

        const subcategories = await this.webStorageService.getSubcategoriesOfCategory(selectedCategory.id)
        this.setState({ subcategories, selectedCategory, selectedSubcategory: null })
        console.log(subcategories)

    }

    updateVideosets = async (selectedSubcategory) => {
        if (!selectedSubcategory)
            return

        const videosets = await this.webStorageService.getVideosetsOfSubcategory(selectedSubcategory.id)
        this.setState({selectedSubcategory,videosets})
    }

    render () {
        const {categories, subcategories, videosets, selectedCategory, selectedSubcategory} = this.state
        
        // const onNullText = <h4 className='select-message'>Select the category</h4>

        const userString = localStorage.getItem('user')
        console.log()

        // console.log(userString === undefined)
        const user = (userString && userString!=='undefined') ? JSON.parse(userString) : null
        const ColorButton = ({className,children, onClick}) => (
            // <div className="add-delete-btn-group btn-group">
                <button type="button" className={`btn btn-outline-${className}`} onClick={onClick}>{children}</button>
            // 
            )
        const addCategoryButton = (user && user.status === 'main-admin')
            ?<ColorButton className="success" onClick={() => this.addCategory()}>Add category</ColorButton>:null

        const addSubcategoryButton = (user && user.status === 'main-admin')
            ?<ColorButton className="success" onClick={() => this.addSubcategory()}>Add subcategory</ColorButton>:null

        const deleteCategoryButton = (user && user.status === 'main-admin')
            ?<ColorButton className="danger" onClick={() => this.deleteCategory()}>Delete this category</ColorButton>:null

        const addVideosetButton = (user && user.status.endsWith('admin'))
            ?<ColorButton className="success" onClick={() => this.addSubcategory()}>Add subcategory</ColorButton>:null


        // console.log(subcategories)
        const categoriesList = (
            <div className="card">
                <div className="card-body">
                    <h4 className="all-categories-title">All Categories</h4>
                    <ItemList onItemSelected={this.onCategorySelected} itemList={categories} />
                    {(!categories || categories.length === 0)?<h3 className='no-content-message'>Oops, there's no content</h3>:null}
                    {addCategoryButton}
                </div>
            </div>)

        
        const renderCategoryTitle = (name) => <h4 className="all-categories-title">Subcategories of category "{name}"</h4>
        const categoryDetails = (!this.state.selectedCategory) ? null : (
            // <div>
            //     <ItemDetails renderTitle={renderCategoryTitle} renderSubitems={this.renderSubcategories} onSubitemSelected={this.onSubcategorySelected} onNullText={onNullText} itemId={this.state.selectedCategory} getData={this.webStorageService.getCategory} getSubitems={this.webStorageService.getSubcategoriesOfCategory} />
            // </div>)
            <div className="card">
                <div className="card-body">
                    {renderCategoryTitle(selectedCategory.name)}
                    <ItemList onItemSelected={this.onSubcategorySelected} itemList={subcategories} />
                    {(!subcategories || subcategories.length === 0)?<h3 className='no-content-message'>Oops, there's no content</h3>:null}
                    <div className="btn-group">
                    {addSubcategoryButton}
                    {deleteCategoryButton}
                    </div>
                </div>
            </div>
            )

        const renderSubcategoryTitle = (name) => <h3 className="subcategory-title">Videosets of subcategory "{name}"</h3>
        const videosetViews = (this.state.selectedSubcategory) ? (
            <div className="card">
                <div className="card-body">
                    {renderSubcategoryTitle(selectedSubcategory.name)}
                    <ItemList itemList={videosets} renderItems={this.renderVideosets}/>
                </div>
            </div>) : null
        return (
            <div>

                <div>
                    <h3 className="categories-title">Categories</h3>
                    <Row left={categoriesList} right={categoryDetails} />
                </div>
                <div className="videoset-views">
                    {videosetViews}
                </div>
            </div>
        )
    }
}

const Row = ({ left, right }) => {
    const width = `row-item col-md-${(right) ? 6 : 12}`;
    return (
        <div className="row mb2">
            <div className={width}>
                {left}
            </div>
            <div className="col-md-6">
                {right}
            </div>
        </div>
    )
}

const VideosetCard = ({ id, name, order }) => {
    const descriptionItem = order.find((item) => item.type === 'VideosetDescription')
    const description = descriptionItem ? descriptionItem.value.split('\n')[0] : null
    const pathToVideoset = `/videosets/${id}`
    const history = useHistory()
    return (
        <div key={id} className="videoset-card card border-success"
            onClick={() => {
                history.push(pathToVideoset)
            }} >
            <div className="card-header">
                <h4 className="videoset-preview-title">
                    <Link to={pathToVideoset}>{name}</Link>
                </h4>
            </div>
            <div className="card-body">
                <h4 className="card-title">Description:</h4>
                <p className="card-text">{description}</p>

            </div>
        </div>)
}