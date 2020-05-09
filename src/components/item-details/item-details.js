import React, { Component } from 'react';
import Spinner from '../spinner/spinner';
import './item-details.css'
export default class ItemDetails extends Component {

    state = {
        item: null,
        subItems:null,
        loading: false
    }

    componentDidMount() {
        this.updateItem()
    }

    updateItem = () => {
        const { itemId, getData, getSubitems } = this.props
        if (!itemId)
            return

        this.setState({ loading: true })
        getData(itemId).then((item) => this.setState({ item }))
        getSubitems(itemId).then((subItems) => this.setState({ subItems, loading: false  }))
    }

    componentDidUpdate(prevProps) {
        if (this.props.itemId !== prevProps.itemId)
            this.updateItem()
    }
    render() {

        const { item, loading, subItems } = this.state

        if(!item)
        return null

        if (loading)
            return <Spinner />

        const { name } = item
        let subItemsViews

        if (!subItems.length)
            subItemsViews = <h4 className='no-content-message'>Oops, there's no content</h4>

        else subItemsViews = this.props.renderSubitems(subItems)


        return (
            <div className="card">

                <div className="card-body">
                    {this.props.renderTitle(name)}
                
                        {subItemsViews}
                    
                </div>
            </div>
        )
    }

}