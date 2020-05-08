import React, { Component } from 'react';

import Spinner from '../spinner/spinner'
import './item-list.css';

export default class ItemList extends Component {

  // swapiService = new SwapiService()

  state = {
    itemList: null
  }

  componentDidMount() {
    const { getData } = this.props
    getData().then((itemList) => {
      this.setState({ itemList })
    })
  }



  render() {

    const { itemList } = this.state
    if (!itemList)
      return <Spinner />

    const itemViews = itemList.map(({ name, id }) => {
      // console.log(`Id ${name}`)
      return (
        <li className="list-group-item"
          key={id}
          onClick={() => this.props.onItemSelected(id)}>{name}</li>
      )
    })
    return (
      
        <ul className="item-list list-group">
          {itemViews}
        </ul>
    
    );
  }
}
