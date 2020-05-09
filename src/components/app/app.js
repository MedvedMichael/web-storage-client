import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Header from '../header/header'
import VideosetPage from '../videoset-page/videoset-page'
import CategoryPage from '../category-page/category-page'
import LoginPage from '../login-page/login-page';

class App extends Component {

    state = {
        user: null
    }

    componentDidMount = () => {
        this.updateUser()
    }

    updateUser = () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'))
            this.setState({ user })
        }
        catch (error) {
            this.setState({ user: null })
        }
    }


    render() {
        const { user } = this.state
        return (
            <div>
                <Router>
                    <Header user={user} onUserUpdate={()=>this.updateUser()}/>
                    <Route path="/" component={CategoryPage} exact={true} />
                    <Route path="/login"  exact={true} 
                    render={()=>{
                        return <LoginPage onUserUpdate={()=>this.updateUser()}/>
                    }}/>
                    <Route path="/videosets/:id"
                        render={({ match }) => {

                            return <VideosetPage id={match.params.id} /> //TODO
                        }} />

                </Router>
            </div>
        )
    }


}
export default App