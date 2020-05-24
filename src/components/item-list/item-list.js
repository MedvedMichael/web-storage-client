import React, { Component } from 'react';

import Spinner from '../spinner/spinner'
import './item-list.css';

export default class ItemList extends Component {

  // swapiService = new SwapiService()

  state = {
    itemList: null
  }

  componentDidMount() {
    console.log(this.props)
    const { itemList } = this.props
    console.log(itemList)
    this.setState({ itemList })
    
  }

  componentDidUpdate = (prevProps) =>{
    if(prevProps.itemList!== this.props.itemList)
    this.updateList()
  }
  updateList = () => {
    const { itemList } = this.props
    this.setState({ itemList })
  }

  onItemSelected = (item) => this.props.onItemSelected(item)


  render() {

    const { itemList } = this.state
    if (!itemList)
      return <Spinner />
    
    console.log(itemList)

    const itemViews = itemList.map((item) => {
      const { name, id } = item
      // console.log(`Id ${name}`)
      return (
        <li className="list-group-item"
          key={id}
          onClick={() => this.props.onItemSelected(item)}>{name}
        </li>
      )
    })
    return (
      
        <ul className="item-list list-group">
          {itemViews}
        </ul>
    
    );
  }
}
