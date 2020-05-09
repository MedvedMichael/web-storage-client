
export default class WebStorageService {
    _apiBase = 'http://localhost:3001'

    signInByCredentials = async (email, password) => {
        const data = {email, password}
        const url = '/users/login'
        const res = await fetch(`${this._apiBase}${url}`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
              'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data) // body data type must match "Content-Type" header
          })

        if(!res.ok)
            return {ok:false, error:res.statusText}
        
        return await res.json()
         
    }

    registerByCredentials = async (name, nickname,email, password) => {
        const data = {name, nickname,email, password}
        const url = '/users'
        const res = await fetch(`${this._apiBase}${url}`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
              'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data) // body data type must match "Content-Type" header
          })

        const result = await res.json()
        if (!res.ok)
            return this.checkDataForErrors(result)
        
        return result
    }


    checkDataForErrors = (data) => {
        
        if (data.name === "ValidationError") {
            const { errors } = data
            const keys = Object.keys(errors)
            for (let index = 0; index<keys.length;index++) {
                const key = keys[index]
                if(errors[key].kind === "required")
                    return { error: "Please enter all information" }
                    
                if (errors[key].kind === "user defined") 
                    return { error: `Invalid ${key}!` }
                
                if (errors[key].kind === "minlength" && key === "password") 
                    return { error: "Password should contain at least 7 characters!" }
                
            }
        }

        else if (data.name === "MongoError"){
            return {error: "This e-mail is already used, try another"}
        }

    }


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

    getVideoset = async (id) =>{
        const videoset = await this.getResourse(`/videoset/${id}`)
        return this._transformItem(videoset)
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