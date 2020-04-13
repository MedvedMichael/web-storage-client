
import React, { Component } from 'react';
import WebStorageService from '../../services/web-storage-service'
import ItemList from '../item-list'
import ItemDetails from '../item-details'
import './category-page.css'
export default class CategoryPage extends Component {

    webStorageService = new WebStorageService()

    state = {
        selectedCategory: null,
        selectedSubcategory:null
    }

    onCategorySelected = (selectedCategory) => {
        this.setState({ selectedCategory })
    }

    getSubcategoriesOfCurrentCategory = () => {
        if(!this.state.selectedCategory)
        return


    }

    render() {
        const onNullText = <h4 className='select-message'>Select the category</h4>
        const categoriesList = (<ItemList onItemSelected={this.onCategorySelected} getData={this.webStorageService.getAllCategories} />)
        const categoryDetails = (<ItemDetails onNullText={onNullText} itemId={this.state.selectedCategory} getData={this.webStorageService.getCategory} />)

        const subcategoryDetails = (<ItemDetails onNullText={null} itemId={this.state.selectedSubcategory} />) //TODO

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