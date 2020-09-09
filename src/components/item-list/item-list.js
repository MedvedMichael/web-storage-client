import React, { Component } from 'react';

import Spinner from '../spinner/spinner'
import './item-list.css';

export default class ItemList extends Component {

  // swapiService = new SwapiService()

  state = {
    itemList: null,
    selected: null
  }

  componentDidMount() {
    this.updateList()
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.itemList !== this.props.itemList || this.props.maxNumber !== prevProps.maxNumber)
      this.updateList()
  }

  updateList = () => {
    const { itemList, maxNumber } = this.props
    this.setState({ itemList, maxNumber, selected:null })
  }

  onItemSelected = (item, index) => { 
    this.setState({ selected: index })
    this.props.onItemSelected(item) 
  }


  render() {

    const { itemList, maxNumber, selected } = this.state
    const { renderItems } = this.props
    if (!itemList)
      return <Spinner />

    const numberOfElements = maxNumber ? maxNumber : itemList.length

    const currentItemList = itemList.slice(0,numberOfElements)
    const itemViews = (!renderItems) ? currentItemList.map((item, index) => {
      const { name, id } = item
      return (
        <li className={`list-group-item ${index === selected ? 'selected-list-group-item' : ''}`}
          key={id}
          onClick={() => this.onItemSelected(item, index)}>{name}
        </li>
      )
    }):renderItems(currentItemList, selected, this.onItemSelected)
  
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
