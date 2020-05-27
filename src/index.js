import React from 'react';
import ReactDOM from 'react-dom';
import './bootstrap.min.css'
import App from './components/app/app'

// import WebStorageService from './services/web-storage-service'

// const webStorageService = new WebStorageService()

// webStorageService.getSubcategoriesOfCaterogy('5e6e267f778aa7368426d5b8')
// .then((categories)=>console.log(categories))
// .catch((error)=>console.log(error))

ReactDOM.render(<App />,  document.getElementById('root'));


