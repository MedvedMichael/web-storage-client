import * as React from 'react';
import DraggableBox from '../draggable-box/draggable-box';


const DraggableListItems = ({items,onItemDeleted}) =>{
  // console.log(props.items.map(toBox))
  return <div> {items.map((item,position)=>toBox(item,position,onItemDeleted))} </div>
}

function toBox(item, position,onItemDeleted) {
  return <DraggableBox onItemDeleted={onItemDeleted} key={item.props.id} className="box" itemPosition={position} value={item.props.id} content={item} />
}

export default DraggableListItems