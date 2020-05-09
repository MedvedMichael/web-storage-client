import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import './header.css'
class Header extends Component {

    onSignOutButtonClick = () => {
        localStorage.setItem('user','')
        localStorage.setItem('token','')
        this.props.onUserUpdate()
    }
    render() {
        // localStorage.setItem('user','')
        const { user } = this.props
        const userCard = (user) ?
            (<div className="user-card card">
                <h5 className="welcome-title">Welcome back, {user.name}!</h5>
                <div className="header-button-group">
                <button className="btn btn-secondary header-button profile-button" type="submit">View profile</button>
                <button className="btn btn-secondary header-button signout-button" type="submit" onClick={this.onSignOutButtonClick}>Sign out</button>
                </div>
            </div>)
            : 
            (<h2 className="login-link">
                <Link  to="/login">Login</Link>
            </h2>)

        return (
            <div className="header d-flex">
                <h1>
                    <Link to="/">Web Storage</Link>
                </h1>
                {userCard}

            </div>
        )
    }
}

export default Header