import React, { Component } from 'react';
import {Redirect} from 'react-router-dom'
import './login-page.css'
import WebStorageService from '../../services/web-storage-service';
export default class LoginPage extends Component {

    webStorageService = new WebStorageService()

    state = {
        redirect:false,
        registerEmail: '',
        registerPassword: '',
        registerName:'',
        registerNickname:'',
        signInEmail: '',
        signInPassword: '',
        onSignInErrorMessage:null,
        onRegisterErrorMessage:null
    }

    onSignInButtonClick = async () => {
        const { signInEmail, signInPassword } = this.state
        const data = await this.webStorageService.signInByCredentials(signInEmail, signInPassword)
        
        if (!data.user) 
            return this.setState({onSignInErrorMessage:"Incorrect e-mail or password!"})
        
        this.setState({onRegisterErrorMessage:null})
        const { user, token } = data
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);

        this.setState({redirect:true})
        this.props.onUserUpdate()
        
    }

    onRegisterButtonClick = async () => {
        const { registerName, registerNickname, registerEmail, registerPassword } = this.state

        
        const data = await this.webStorageService.registerByCredentials(registerName, registerNickname, registerEmail, registerPassword)
        
        if (data.error) {
            return this.setState({onRegisterErrorMessage:data.error})
        }
        this.setState({onRegisterErrorMessage:null})
        const { user, token } = data
        
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);

        this.setState({redirect:true})
        this.props.onUserUpdate()
    }

    renderRedirect = () => {
        if(this.state.redirect)
            return <Redirect to="/" />
    }

    render() {

        const {onRegisterErrorMessage, onSignInErrorMessage} = this.state
        const registerCard = (<div className="login-card card">
            <div className="login">
            {this.renderRedirect()}
                <h3 className="login-title">Or if you don't</h3>
                <h1 className="login-title-second">Register</h1>
                <div className="input-group input-group-lg mb-3">
                    <input type="text" className="form-control" placeholder="Name" aria-label="Name" onChange={({target}) => this.setState({ registerName: target.value })} />
                </div>
                <div className="input-group input-group-lg mb-3">
                    <input type="text" className="form-control" placeholder="Nickname" aria-label="Nickname" onChange={({target}) => this.setState({ registerNickname: target.value })} />
                </div>

                <div className="input-group input-group-lg mb-3">
                    <input type="text" className="form-control" placeholder="E-mail" aria-label="E-mail" onChange={({target}) => this.setState({ registerEmail: target.value })} />
                </div>
                <div className="input-group input-group-lg mb-3">
                    <input type="password" className="form-control" placeholder="Password" aria-label="Password" onChange={({target}) => this.setState({ registerPassword: target.value })} />
                </div>
                <h4 className="error-message text-danger">{onRegisterErrorMessage}</h4>
                <div className="form-group">
                    <button className="btn btn-secondary login-button" type="submit" onClick={this.onRegisterButtonClick}>Register</button>
                </div>
            </div>
        </div>)

        const signInCard = (
            <div className="login-card card">
                <div className="login">

                    <h3 className="login-title">If you have an account</h3>
                    <h1 className="login-title-second">Sign in</h1>
                    <div>
                        <div className="input-group input-group-lg mb-3">
                            <input type="text" className="form-control" placeholder="E-mail" aria-label="Username" onChange={({target}) => this.setState({ signInEmail: target.value })} />

                        </div>
                        <div className="input-group input-group-lg mb-3">
                            <input type="password" className="form-control" placeholder="Password" aria-label="Password" onChange={({target}) => this.setState({ signInPassword: target.value })} />
                        </div>
                        <h4 className="error-message text-danger">{onSignInErrorMessage}</h4>
                        <div className="form-group">
                            <button className="btn btn-secondary login-button" type="submit" onClick={this.onSignInButtonClick}>Sign in</button>
                        </div>
                    </div>

                </div>
            </div>
        )

        return (
            <div className="login-page">
                <Row left={signInCard} right={registerCard} />
            </div>
        )
    }
}

const Row = ({ left, right }) => {
    const width = `row-item col-md-${(right) ? 6 : 12}`;
    return (
        <div className="row mb2">
            <div className={width}>
                {left}
            </div>

            <div className="col-md-6">
                {right}
            </div>
        </div>
    )
}