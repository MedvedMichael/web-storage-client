
export default class WebStorageService {
    // _apiBase = 'http://localhost:3001/api'
       _apiBase = 'https://mike-test-heroku-node.herokuapp.com/api'
    getResourse = async (url) => {
        const res = await fetch(`${this._apiBase}${url}`)
        if (!res.ok)
            throw new Error(`Could not fetch ${url}`)

        return await res.json()
    }

    getLast10Videosets = async (id) => {
        return this.getResourse(`/videosets-last-10?categoryId=${id}`).then((videosets)=>videosets.map(this._transformItem))
    }
    getAllSubcategories = async () => {
        const subcategories = await this.getResourse('/subcategoriesall')
        return subcategories.map(this._transformItem)
    }


    getAllUsers = async () => {
        const token = localStorage.getItem('token')
        const res = await fetch(`${this._apiBase}/usersall`, {
            method: 'GET',
            mode:'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
        

        if(!res.ok){
            return {error:true}
        }

        const users = await res.json()
        return users.map(this._transformItem)
    }

    patchUserByMainAdmin = async (id,body) => {
        const token = localStorage.getItem('token')
        const res = await fetch(`${this._apiBase}/users?id=${id}`, {
            method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(body) // body data type must match "Content-Type" header
        })
        
        if(!res.ok)
        return {error:true}

        return await res.json()
    } 

    postCategory = async (name) => {
        const data = {name, isPublished:true}
        const token = localStorage.getItem('token')
        const res = await fetch(`${this._apiBase}/categories`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        })
        if (!res.ok){
            
            return { error: true }
        }

        return await res.json()
    }

    postSubcategory = async (name, categoryId, type = "text") => {
        const data = {name, type}
        const token = localStorage.getItem('token')
        const res = await fetch(`${this._apiBase}/subcategories?categoryId=${categoryId}`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        })
        if (!res.ok){
            
            return { error: true }
        }

        return await res.json()
    }

    postVideoset = async (name,subcategoryId) => {
        const data = {name}
        const token = localStorage.getItem('token')
        const res = await fetch(`${this._apiBase}/videoset?subcategoryId=${subcategoryId}`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        })
        if (!res.ok){
            
            return { error: true }
        }
    }

    postFormData = async(url,id,file,type,data) => {
        const token = localStorage.getItem('token')
        
        const res = await fetch(`${this._apiBase}${url}${id}`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        })
        
        if (!res.ok){
            return { error: true }
        }
        const temp = await res.json();
        const itemId = temp._id;
        const formData = new FormData()
        formData.append(type, file)

        const newUrl = url.slice(0,url.indexOf('?'))
        const uploading = await fetch(`${this._apiBase}${newUrl}/upload/${itemId}`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Authorization':`Bearer ${token}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData // body data type must match "Content-Type" header,
        })
      
        if (!uploading.ok)
            return { error: true }

        return { ok: true }
    }

    postPicture = async (id, file) => {
        return await this.postFormData('/picture?pictureSliderId=', id, file, 'image', { source: 'local' })
    }

    postLogo = async (id, file) => {
        return await this.postFormData('/logo?videosetId=', id, file, 'image', { source: 'local' })
    }

    postVideo = async (id, name, file) => {
        return await this.postFormData('/video?videosContainerId=',id,file,'video',{source:'local', name})
    }

    postURLVideo = async (id, name, url) => {
        const data = { source: 'external', name, file: url }
        const token = localStorage.getItem('token')
        const res = await fetch(`${this._apiBase}/video?videosContainerId=${id}`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        })

        if(!res.ok)

        return {error:true}

        return await res.json()
    }




    postSlider = async (videosetId) => {
        const token = localStorage.getItem('token')
        const res = await fetch(`${this._apiBase}/picture-slider?videosetId=${videosetId}`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            }
            // body: JSON.stringify(data) // body data type must match "Content-Type" header
        })

        if(!res.ok){
            
            return {error:true}
        }


        const slider = await res.json();
        return this._transformItem(slider)
    }

    postVideosContainer = async (videosetId) => {
        const token = localStorage.getItem('token')
        const res = await fetch(`${this._apiBase}/videos-container?videosetId=${videosetId}`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            }
            // body: JSON.stringify(data) // body data type must match "Content-Type" header
        })

        if(!res.ok){
            
            return {error:true}
        }


        const videosContainer = await res.json();
        return this._transformItem(videosContainer)
    }


    deleteItem = async (url, id) => {
        const token = localStorage.getItem('token')
        const res = await fetch(`${this._apiBase}${url}?id=${id}`, {
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            }
            // body: JSON.stringify(data) // body data type must match "Content-Type" header
        })
        
        if(!res.ok)
        return {error:true}

        return await res.json()
    }

    deleteSlider = async (id) => {
        return await this.deleteItem('/picture-slider',id)
    }

    deleteVideosContainer = async (id) => {
        return await this.deleteItem('/videos-container',id)
    }

    deleteVideoset = async (id) => {
        return await this.deleteItem('/videoset',id)
    }

    deleteCategory = async (id) => {
        return await this.deleteItem('/categories', id)
    }

    deleteSubcategory = async (id) => {
        return await this.deleteItem('/subcategories', id)
    }

    deleteLogo = async (id) => {
        const token = localStorage.getItem('token')
        const res = await fetch(`${this._apiBase}/logo?videosetId=${id}`, {
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            }
            // body: JSON.stringify(data) // body data type must match "Content-Type" header
        })
        
        if(!res.ok)
        return {error:true}

        return await res.json()
    }

    patchVideoset = async (id, props) => {
        const token = localStorage.getItem('token')
        const res = await fetch(`${this._apiBase}/videosets?videosetId=${id}`, {
            method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(props) // body data type must match "Content-Type" header
        })

        
        if(!res.ok)
        return {error:true}

        return await res.json()
    }

    deletePhoto = async (id) => {
        return await this.deleteItem('/picture',id)
    }

    deleteVideo = async (id) => {
        return await this.deleteItem('/video',id)

    }

    getPicturesOfSlider = async (id) => {
        const pictures = await this.getResourse(`/pictures?pictureSliderId=${id}`)
        return pictures.map(picture => `${this._apiBase}/picture/${picture._id}`)
    }

    signInByCredentials = async (email, password) => {
        const data = { email, password }
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

        if (!res.ok)
            return { ok: false, error: res.statusText }

        return await res.json()

    }

    registerByCredentials = async (name, nickname, email, password) => {
        const data = { name, nickname, email, password }
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

    getUserProfile = async (token) => {
        const url = '/users/me'
        const res = await fetch(`${this._apiBase}${url}`, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
        if (!res.ok)
            return { error: true }

        return await res.json()
    }


    checkDataForErrors = (data) => {

        if (data.name === "ValidationError") {
            const { errors } = data
            const keys = Object.keys(errors)
            for (let index = 0; index < keys.length; index++) {
                const key = keys[index]
                if (errors[key].kind === "required")
                    return { error: "Please enter all information" }

                if (errors[key].kind === "user defined")
                    return { error: `Invalid ${key}!` }

                if (errors[key].kind === "minlength" && key === "password")
                    return { error: "Password should contain at least 7 characters!" }

            }
        }

        else if (data.name === "MongoError") {
            return { error: "This e-mail is already used, try another" }
        }

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

    getVideosetsOfSubcategory = async (subcategoryId) => {
        const videosets = await this.getResourse(`/videosets?subcategoryId=${subcategoryId}`)
        return videosets.map(this._transformItem)
    }

    getVideoset = async (id) => {
        const videoset = await this.getResourse(`/videoset/${id}`)
        return this._transformItem(videoset)
    }


    getVideosOfVideosContainer = async (id) => {
        const videos = await this.getResourse(`/videos?videosContainerId=${id}`)
        return videos.map(this._transformItem)
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
            subItems: subcategories
        }
    }



}