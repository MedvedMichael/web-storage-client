import React, { Component } from 'react';

import Spinner from '../spinner/spinner'
import './item-list.css';

export default class ItemList extends Component {

  // swapiService = new SwapiService()

  state = {
    itemList: null
  }

  componentDidMount() {
    // console.log(this.props)
    // const { itemList } = this.props
    // // console.log(itemList)
    // this.setState({ itemList })
    this.updateList()
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.itemList !== this.props.itemList || this.props.maxNumber !== prevProps.maxNumber)
      this.updateList()
  }

  updateList = () => {
    const { itemList, maxNumber } = this.props
    this.setState({ itemList, maxNumber })
    console.log(maxNumber)
  }

  onItemSelected = (item) => this.props.onItemSelected(item)


  render() {

    const { itemList, maxNumber } = this.state
    const { renderItems, onItemSelected = () => { } } = this.props
    if (!itemList)
      return <Spinner />
    
    console.log(itemList)

    const numberOfElements = maxNumber ? maxNumber : itemList.length


    const currentItemList = itemList.slice(0,numberOfElements)
    const itemViews = (!renderItems)? currentItemList.map((item) => {
      const { name, id } = item
      // console.log(`Id ${name}`)
      return (
        <li className="list-group-item"
          key={id}
          onClick={() => onItemSelected(item)}>{name}
        </li>
      )
    }):renderItems(currentItemList)
    return (
      <div>
        <ul className="item-list list-group">
          {itemViews}
        </ul>
        <div style={{display:'flex'}}>
          {(maxNumber && maxNumber < itemList.length) ? (<button type="button" className="show-more-button btn btn-lg btn-outline-success" onClick={this.props.showMore}>Show more</button>) : null}
        </div>
      </div>

    );
  }
}
