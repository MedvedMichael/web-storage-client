
import React, { Component } from 'react';
import { Link, useHistory } from 'react-router-dom'
import WebStorageService from '../../services/web-storage-service'
import ItemList from '../item-list/item-list'
import ItemDetails from '../item-details/item-details'
import './category-page.css'
export default class CategoryPage extends Component {

    webStorageService = new WebStorageService()

    state = {
        selectedCategory: null,
        selectedSubcategory: null,
        categories:null,
        subcategories:null
    }

    componentDidMount = async () => {
        await this.updateCategories()
    }

    onCategorySelected = async (selectedCategory) => {
        await this.updateSubcategories(selectedCategory)
    }

    onSubcategorySelected = (selectedSubcategory) => {
        this.setState({ selectedSubcategory })
    }
    // renderSubcategories = (subcategories) => {
    //     return (
    //         <ItemDetails itemList={subcategories} onItemSelected={this.onSubcategorySelected}/>
    //         // <ul className="subcategories-list item-list list-group">
    //         //     {subcategories.map(({ id, name }) => {
    //         //         return (
    //         //             <li className="list-group-item"
    //         //                 key={id}
    //         //                 onClick={() => { this.onSubcategorySelected(id) }}>
    //         //                 {name}
    //         //             </li>
    //         //         )
    //         //     })}
    //         // </ul>)
    //     )}


    
    renderVideosets = (videosets) => {
        const videosetsCards = videosets.map((props,index) => {
            const key = `VideosetCard-${index}`
            return (
                <VideosetCard key={key} {...props}/>
            )
        })



        return (
            <div className="videosets-container container">
                {/* <ul className="list-group"> */}

                {videosetsCards}

                {/* </ul> */}
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
        await this.webStorageService.postSubcategory(name, 'text', this.state.selectedCategory)
        await this.updateSubcategories()
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

    render () {
        const {categories, subcategories, selectedCategory} = this.state
        
        // const onNullText = <h4 className='select-message'>Select the category</h4>

        const userString = localStorage.getItem('user')
        // console.log(userString)
        // console.log(userString === undefined)
        const user = (userString) ? JSON.parse(userString) : null
        const successButton = (name, onClick) => (
            // <div className="add-delete-btn-group btn-group">
                <button type="button" className="btn btn-outline-success" onClick={onClick}>{name}</button>
            // 
            )
        const addCategoryButton = (user && user.status.endsWith('admin'))
            ?successButton('Add category', () => this.addCategory()):null

        const addSubcategoryButton = (user && user.status.endsWith('admin'))
            ?successButton('Add subcategory', () => this.addSubcategory()):null


        // console.log(subcategories)
        const categoriesList = (
            <div className="card">
                <div className="card-body">
                    <h4 className="all-categories-title">All Categories</h4>
                    <ItemList onItemSelected={this.onCategorySelected} itemList={categories} />
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
                    {addSubcategoryButton}
                </div>
            </div>
            )
        const renderSubcategoryTitle = (name) => <h3 className="subcategory-title">Videosets of subcategory "{name}"</h3>
        const videosetViews = (this.state.selectedSubcategory) ? (<ItemDetails renderTitle={renderSubcategoryTitle} renderSubitems={this.renderVideosets} onSubitemSelected={() => { }} itemId={this.state.selectedSubcategory.id} getData={this.webStorageService.getSubcategory} getSubitems={this.webStorageService.getVideosetsOfSubcategory} />) : null

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

const VideosetCard = ({ id, name, description }) => {

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
                <h4 className="card-title">Description</h4>
                <p className="card-text">{description}</p>

            </div>
        </div>)
}