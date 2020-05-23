
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
        redirectTo: null
    }

    onCategorySelected = (selectedCategory) => {
        this.setState({ selectedCategory, selectedSubcategory: null })
    }

    onSubcategorySelected = (selectedSubcategory) => {
        this.setState({ selectedSubcategory })
    }

    getSubcategoriesOfCurrentCategory = () => {
        if (!this.state.selectedCategory)
            return
    }

    renderSubcategories = (subcategories) => {
        return (
            <ul className="subcategories-list item-list list-group">
                {subcategories.map(({ id, name }) => {
                    return (
                        <li className="list-group-item"
                            key={id}
                            onClick={() => { this.onSubcategorySelected(id) }}>
                            {name}
                        </li>
                    )
                })}
            </ul>)
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
                {/* <ul className="list-group"> */}

                {videosetsCards}

                {/* </ul> */}
            </div>
        )
    }



    render() {
        const onNullText = <h4 className='select-message'>Select the category</h4>
        const categoriesList = (
            <div className="card">
                <div className="card-body">
                    <h4 className="all-categories-title">All Categories</h4>
                    <ItemList onItemSelected={this.onCategorySelected} getData={this.webStorageService.getAllCategories} />
                </div>
            </div>)
        const renderCategoryTitle = (name) => <h4 className="category-title">Subcategories of category "{name}"</h4>
        const categoryDetails = (!this.state.selectedCategory) ? null : (<ItemDetails renderTitle={renderCategoryTitle} renderSubitems={this.renderSubcategories} onSubitemSelected={this.onSubcategorySelected} onNullText={onNullText} itemId={this.state.selectedCategory} getData={this.webStorageService.getCategory} getSubitems={this.webStorageService.getSubcategoriesOfCategory} />)

        const renderSubcategoryTitle = (name) => <h3 className="subcategory-title">Videosets of subcategory "{name}"</h3>
        const videosetViews = (this.state.selectedSubcategory) ? (<ItemDetails renderTitle={renderSubcategoryTitle} renderSubitems={this.renderVideosets} onSubitemSelected={() => { }} itemId={this.state.selectedSubcategory} getData={this.webStorageService.getSubcategory} getSubitems={this.webStorageService.getVideosetsOfSubcategory} />) : null

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

    const pathToVideoset = `/edit-videoset/${id}`
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