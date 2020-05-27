import React, { Component } from 'react';
import { Link, useHistory } from 'react-router-dom'
import './header.css'
import WebStorageService from '../../services/web-storage-service';
class Header extends Component {

    webStorageService = new WebStorageService()
    onSignOutButtonClick = () => {
        localStorage.setItem('user', '')
        localStorage.setItem('token', '')
        this.props.onUserUpdate()
    }

    componentDidMount = async () => {
        const token = localStorage.getItem('token'),
        user = localStorage.getItem('user')

        if (!token || !user)
            return

        const profile = await this.webStorageService.getUserProfile(token)
        if (profile.error) {
            return this.updateLocalStorage()
        }
        this.updateLocalStorage(JSON.stringify(profile),token)
        
    }

    updateLocalStorage = (user, token) => {
        localStorage.setItem('user', user)
        localStorage.setItem('token', token)
        this.props.onUserUpdate()
    }

    render() {
        // localStorage.setItem('user','')
        const { user } = this.props


        const ViewAllUsersButton = () => {
            const history = useHistory()
            const onClick = () => {
                history.push('/users')
            }
            return (<button onClick={onClick} className="btn btn-primary" type="submit">View all users</button>)
        }

        const userCard = (user) ?
            (<div className="user-card card">
                <h5 className="welcome-title">Welcome back, {user.name}!</h5>
                <div className="header-button-group">
                    <button className="btn btn-secondary header-button profile-button" type="submit">View profile</button>
                    <button className="btn btn-secondary header-button signout-button" type="submit" onClick={this.onSignOutButtonClick}>Sign out</button>
                </div>
                <div className="btn-group">
                    {(user.status === 'main-admin') ? (<ViewAllUsersButton />) : null}
                </div>
            </div>)
            :
            (<h2 className="login-link">
                <Link to="/login">Login</Link>
            </h2>)

        return (
            <div className="header d-flex">
                <div className="web-storage-title">
                    <Link to="/">Web Storage</Link>
                </div>
                {userCard}

            </div>
        )
    }
}

export default Header