import React, { Component } from 'react';
import WebStorageService from '../../services/web-storage-service';
import './edit-users-page.css'
import ItemList from '../item-list/item-list';
export default class EditUsersPage extends Component {

    webStorageService = new WebStorageService()

    state = {
        admin:null,
        allUsers:null,
        numberOfUsers:20
    }

    componentDidMount = async () =>{
        this.updateUsers()
        // await this.updateUsers()
    }

    updateUsers = async () => {
        const userString = localStorage.getItem('user')
        if(!userString || userString==='undefined')
        return
        

        const user = JSON.parse(userString)
        if(user.status !== 'main-admin')
        return
        
        const allUsers = await this.webStorageService.getAllUsers()
        const updatedUsers = allUsers.filter((item) => item.id !== user.id).sort((user1, user2) => user2.status.length - user1.status.length)
        
        this.setState({admin:user, allUsers:updatedUsers})
    }

    changeUserStatus = async (id, changes) => {
        await this.webStorageService.patchUserByMainAdmin(id, changes)
        
        await this.updateUsers()
    }

    renderUserViews = (users) => {
        const usersCards = users.map((user,index) => {
            const key = `User-Card-${index}`
            const extraClassName=(user.status === 'main-admin')?'border-warning':null
            return <UserCard extraClassName={extraClassName} key={key} user={user} changeStatus={this.changeUserStatus} />
        })
        return (
            <div className="videosets-container container">
                {usersCards}
            </div>
        ) 
    }

    render(){
        const {allUsers, numberOfUsers} = this.state
        return (
            <div>
                <h1 className="all-users-title">All registered users</h1>
                <ItemList showMore={() => this.setState({ numberOfUsers: numberOfUsers + 3 })} maxNumber={numberOfUsers} itemList={allUsers} renderItems={this.renderUserViews} />
            </div>
        )
    }
}



const UserCard = ({ user, changeStatus, extraClassName }) => {
    const { id, name, nickname, status, ban, email } = user
    const makeAdmin = () => changeStatus(id, { status: 'admin' })
    const banUser = () => changeStatus(id, { ban: true })
    const unbanUser = () => changeStatus(id, { ban: false })
    const makeMainAdmin = () => changeStatus(id, { status: 'main-admin' })
    const makeUser = () => changeStatus(id, {status: 'user'})

    const colorButton = (title, onClick, extraClassName) => <button className={`btn btn-${extraClassName?extraClassName:null}`} onClick={onClick}>{title}</button>
    
    const makeAdminButton = (status !== 'admin' && !ban) ? colorButton('Make admin',makeAdmin,'primary') : null
    const banUserButton = (!ban) ? colorButton('Ban user',banUser, 'danger'):null
    const unbanUserButton = (ban) ? colorButton('Unban user',unbanUser, 'success'): null
    const makeMainAdminButton = (status==='admin' && !ban) ? colorButton('Make main-admin',makeMainAdmin, 'info'): null
    const makeUserButton = (status!=='user' && !ban) ? colorButton('Make user', makeUser, 'warning'):null
    return (
        <div className={`card border-primary ${extraClassName}`}>
            <div className="card-body row d-flex" >
                <h4 className="user-card-title">{name} @{nickname} {email}</h4>
                <div className="user-view-btn-group btn-group">
                    {makeMainAdminButton}
                    {makeAdminButton}
                    {makeUserButton}
                    {banUserButton}
                    {unbanUserButton}
                </div>
            </div>
        </div>
    )
}