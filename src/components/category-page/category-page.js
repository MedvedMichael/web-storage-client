
import React, { Component } from 'react';
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
        this.setState({ selectedCategory })
    }

    onSubcategorySelected = (selectedSubcategory) => {
        this.setState({ selectedSubcategory })
    }

    getSubcategoriesOfCurrentCategory = () => {
        if (!this.state.selectedCategory)
            return
    }

    renderSubcategories = (subcategories) => {
        return subcategories.map(({ id, name }) => {
            return (
                <li className="list-group-item"
                    key={id}
                    onClick={() => { this.onSubcategorySelected(id) }}>
                    {name}
                </li>
            )
        })
    }

    renderVideosets = (videosets) => {

        const videosetsCards = videosets.map(({ name, description, id }) => {
            return (
                <div key={id} className="card">
                    <div className="card-body">
                        <h4>{name}</h4>

                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                <span className="term">Description</span>
                                <span>{description}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            )
        })



        return (
            <div>
            <ul className="list-group">

                {videosetsCards}
            </ul>
            </div>
        )
    }



    render() {
        const onNullText = <h4 className='select-message'>Select the category</h4>
        const categoriesList = (<ItemList onItemSelected={this.onCategorySelected} getData={this.webStorageService.getAllCategories} />)
        const categoryDetails = (<ItemDetails renderSubitems={this.renderSubcategories} onSubitemSelected={this.onSubcategorySelected} onNullText={onNullText} itemId={this.state.selectedCategory} getData={this.webStorageService.getCategory} getSubitems={this.webStorageService.getSubcategoriesOfCategory} />)


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
    return (
        <div className="row mb2">
            <div className="col-md-6">
                {left}
            </div>
            <div className="col-md-6">
                {right}
            </div>
        </div>
    )
}