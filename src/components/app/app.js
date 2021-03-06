import React, { Component } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom'
import Header from '../header/header'
import VideosetEditorPage from '../videoset-editor-page/videoset-editor-page'
import VideosetPage from '../videoset-page/videoset-page.jsx'
import CategoryPage from '../category-page/category-page'
import LoginPage from '../login-page/login-page';
import EditUsersPage from '../edit-users-page/edit-users-page';

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
                    <Route path="/users" exact={true} component={EditUsersPage}/>
                    <Route path="/login"  exact={true} 
                    render={()=>{
                        return <LoginPage onUserUpdate={()=>this.updateUser()}/>
                    }}/>
                    <Route path="/videosets/:id"
                        render={({ match }) => {

                            return <VideosetPage id={match.params.id} /> //TODO
                        }} />
                    <Route path="/edit-videoset/:id"
                        render={({ match }) => {

                            return <VideosetEditorPage id={match.params.id} /> //TODO
                        }} />

                </Router>
            </div>
        )
    }


}
export default App