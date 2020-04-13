import React, { Component } from 'react';
import Spinner from '../spinner';
import './item-details.css'
export default class ItemDetails extends Component {

    state = {
        item: null,
        loading: false
    }

    componentDidMount() {
        this.updateItem()
    }

    updateItem = () => {
        const { itemId, getData } = this.props
        if (!itemId)
            return

        this.setState({ loading: true })
        getData(itemId).then((item) => this.setState({ item, loading: false }))
    }

    componentDidUpdate(prevProps) {
        if (this.props.itemId !== prevProps.itemId)
            this.updateItem()
    }
    render() {

        const { item, loading } = this.state
        if (!item)
            return (
                <li className="list-group-item">
                    {this.props.onNullText}
                </li>)
        if (loading)
            return <Spinner />

        const { name, subItems } = item
        let subItemsViews

        if (subItems.length === 0)
            subItemsViews = <h4 className='no-content-message'>Oops, there's no content</h4>

        else subItemsViews = subItems.map(({ _id, name }) => {
            // console.log(description)
            return (
                <div key={_id}>
                    <li className="list-group-item">
                        <div>
                            <span>{name}</span>
                            
                        </div>
                    </li>
                </div>)
        })


        return (
            <div className="person-details card">

                <div className="card-body">
                    <h4>{name}</h4>
                    <ul className="item-list list-group">
                        {subItemsViews}
                    </ul>
                </div>
            </div>
        )
    }

}