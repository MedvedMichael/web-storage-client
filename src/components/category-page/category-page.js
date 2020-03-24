
import React, { Component } from 'react';
import WebStorageService from '../../services/web-storage-service'
import ItemList from '../item-list'
import ItemDetails from '../item-details'
import './category-page.css'
export default class CategoryPage extends Component {

    webStorageService = new WebStorageService()

    state = {
        selectedCategory: null
    }

    onCategorySelected = (selectedCategory) => {
        this.setState({ selectedCategory })
    }

    getSubcategoriesOfCurrentCategory = () => {
        if(!this.state.selectedCategory)
        return

        
    }

    render() {
        const categoriesList = (<ItemList onItemSelected={this.onCategorySelected} getData={this.webStorageService.getAllCategories} />)
        const categoryDetails = (<ItemDetails itemId={this.state.selectedCategory} getData={this.webStorageService.getCategory} />)

        return (
            <div>
                <h3>Categories</h3>
                <Row left={categoriesList} right={categoryDetails} />
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