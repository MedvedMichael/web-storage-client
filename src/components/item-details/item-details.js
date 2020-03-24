import React, { Component } from 'react';
import Spinner from '../spinner';

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
            return <span>Kukusiki</span>

        if (loading)
            return <Spinner />

        const { name, subItems } = item

        const subItemsViews = subItems.map(({ name }) => {
            return (
                <li className="list-group-item">
                    <span>{name}</span>
                </li>)
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