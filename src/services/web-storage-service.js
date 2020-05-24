
export default class WebStorageService {
    _apiBase = 'http://localhost:3001'

    getResourse = async (url) => {
        const res = await fetch(`${this._apiBase}${url}`)
        if (!res.ok)
            throw new Error(`Could not fetch ${url}`)
        return await res.json()
    }

    postCategory = async (name) => {
        const data = {name}
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
            console.log(res)
            return { error: true }
        }

        return await res.json()
    }

    postSubcategory = async (name, type, categoryId) => {
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
            console.log(res)
            return { error: true }
        }

        return await res.json()
    }



    postPicture = async (id, file) => {
        console.log(file)
        const token = localStorage.getItem('token')
        const data = { source: 'local' }
        const res = await fetch(`${this._apiBase}/picture?pictureSliderId=${id}`, {
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
            console.log(res)
            return { error: true }
        }
        const temp = await res.json();
        console.log(temp)
        const pictureId = temp._id;

        const formData = new FormData()
        formData.append('image', file)
        
        const uploadingPhoto = await fetch(`${this._apiBase}/picture/upload/${pictureId}`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Authorization':`Bearer ${token}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData, // body data type must match "Content-Type" header,
            onUploadProgress: progressEvent => {
                let complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%'
                console.log('complete: ', complete)
              }
        })


        console.log(uploadingPhoto)
        if (!uploadingPhoto.ok)
            return { error: true }

        
        return { ok: true }

    }

    postVideo = async (id, name, file) => {
        console.log(file)
        const token = localStorage.getItem('token')
        const data = { source: 'local', name }
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
        
        if (!res.ok){
            console.log(res)
            return { error: true }
        }
        const temp = await res.json();
        // console.log(temp)
        const videoId = temp._id;

        const formData = new FormData()
        formData.append('image', file)
        
        const uploadingVideo = await fetch(`${this._apiBase}/video/upload/${videoId}`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Authorization':`Bearer ${token}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData, // body data type must match "Content-Type" header,
            onUploadProgress: progressEvent => {
                let complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%'
                console.log('complete: ', complete)
              }
        })


        console.log(uploadingVideo)
        if (!uploadingVideo.ok)
            return { error: true }

        
        return { ok: true }

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
            console.log(res)
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
            console.log(res)
            return {error:true}
        }


        const videosContainer = await res.json();
        return this._transformItem(videosContainer)
    }

    deleteSlider = async (id) => {
        const token = localStorage.getItem('token')
        const res = await fetch(`${this._apiBase}/picture-slider?id=${id}`, {
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            }
            // body: JSON.stringify(data) // body data type must match "Content-Type" header
        })
        console.log(res)
        if(!res.ok)
        return {error:true}

        return await res.json()

    }

    deleteVideosContainer = async (id) => {
        const token = localStorage.getItem('token')
        const res = await fetch(`${this._apiBase}/videos-container?id=${id}`, {
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            }
            // body: JSON.stringify(data) // body data type must match "Content-Type" header
        })
        console.log(res)
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

        console.log(res)
        if(!res.ok)
        return {error:true}

        return await res.json()
    }

    deletePhoto = async (id) => {
        const token = localStorage.getItem('token')
        const res = await fetch(`${this._apiBase}/picture?id=${id}`, {
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            }
            // body: JSON.stringify(props) // body data type must match "Content-Type" header
        })

        if(!res.ok) return {error:true}

        return await res.json()

    }

    deleteVideo = async (id) => {
        const token = localStorage.getItem('token')
        const res = await fetch(`${this._apiBase}/video?id=${id}`, {
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            }
            // body: JSON.stringify(props) // body data type must match "Content-Type" header
        })

        if(!res.ok) return {error:true}

        return await res.json()

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
        console.log(videos)
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