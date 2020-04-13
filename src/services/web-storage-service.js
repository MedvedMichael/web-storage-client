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
        return categories.map(this._transformCategory)
    }

    getSubcategoriesOfCaterogy = async (categoryId) => {
        const subcategories = await this.getResourse(`/subcategories?categoryId=${categoryId}`)
        return subcategories
    }

    getCategory = async (id) => {
        const category = await this.getResourse(`/categories/${id}`)
        return this._addSubcategoriesToCategory(this._transformCategory(category))
    }

    getVideosetsOfSubcategory = async (id) =>{
        const videosets = await this.getResourse(`/videosets?`)//TODO
    }

    _transformCategory = (category) => {
        return {
            ...category,
            id: category._id,
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