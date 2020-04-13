export default class WebStorageService {
    _apiBase = 'http://localhost:3001'

    getResourse = async (url) => {
        const res = await fetch(`${this._apiBase}${url}`)
        if (!res.ok)
            throw new Error(`Could not fetch ${url}`)
        return await res.json()
    }

    getAllCategories = async () => {
        const categories = await this.getResourse('/categories')
        return categories.map(this._transformItem)
    }

    getSubcategoriesOfCategory = async (categoryId) => {
        const subcategories = await this.getResourse(`/subcategories?categoryId=${categoryId}`)
        return subcategories.map(this._transformItem)
    }

    getSubcategory = async (id) => {
        const subcategory = await this.getResourse(`/subcategories/${id}`)
        return this._transformItem(subcategory)
    }

    getCategory = async (id) => {
        const category = await this.getResourse(`/categories/${id}`)
        return this._addSubcategoriesToCategory(this._transformItem(category))
    }

    getVideosetsOfSubcategory = async (subcategoryId) =>{
        const videosets = await this.getResourse(`/videosets?subcategoryId=${subcategoryId}`)
        return videosets.map(this._transformItem)
    }

    _transformItem = (item) => {
        return {
            ...item,
            id: item._id,
        }
    }


    _addSubcategoriesToCategory = async (category) => {
        const subcategories = await this.getResourse(`/subcategories?categoryId=${category.id}`)
        return {
            ...category,
            subItems:subcategories
        }
    }



}