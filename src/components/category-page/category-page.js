
import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import WebStorageService from '../../services/web-storage-service'
import ItemList from '../item-list'
import ItemDetails from '../item-details'
import './category-page.css'
export default class CategoryPage extends Component {

    webStorageService = new WebStorageService()

    state = {
        selectedCategory: null,
        selectedSubcategory: null
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

        const videosetsCards = videosets.map(({ name, description, id }) => {
            const pathToVideoset = `/videosets/${id}`
            return (
                <div key={id} className="videoset-card card">
                    <div className="card-body">
                        <h4>
                            <Link to={pathToVideoset}>{name}</Link>
                        </h4>

                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                <h5 className="term">Description</h5>
                                <span>{description}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            )
        })



        return (
            <div className="videosets-container container">
                {/* <ul className="list-group"> */}
                <div className="row">
                    {videosetsCards}
                </div>
                {/* </ul> */}
            </div>
        )
    }



    render() {
        const onNullText = <h4 className='select-message'>Select the category</h4>
        const categoriesList = (
            <div className="card">
                <div className="card-body">
                    <h4>Categories</h4>
                    <ItemList onItemSelected={this.onCategorySelected} getData={this.webStorageService.getAllCategories} />
                </div>
            </div>)

        const categoryDetails = (!this.state.selectedCategory)?null:(<ItemDetails renderSubitems={this.renderSubcategories} onSubitemSelected={this.onSubcategorySelected} onNullText={onNullText} itemId={this.state.selectedCategory} getData={this.webStorageService.getCategory} getSubitems={this.webStorageService.getSubcategoriesOfCategory} />)

        const videosetViews = (this.state.selectedSubcategory) ? (<ItemDetails renderSubitems={this.renderVideosets} onSubitemSelected={() => { }} itemId={this.state.selectedSubcategory} getData={this.webStorageService.getSubcategory} getSubitems={this.webStorageService.getVideosetsOfSubcategory} />) : null

        return (
            <div>
                <div>
                    <h3>Categories</h3>
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
    const width = `row-item col-md-${(right)?6:12}`;
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