import * as React from 'react';
import DraggableBox from '../draggable-box/draggable-box';


const DraggableListItems = (props) =>{
  // console.log(props.items.map(toBox))
  return <div> {props.items.map(toBox)} </div>
}

function toBox(item, position) {
    console.log(item)
  return <DraggableBox key={item.props.id} className="box" itemPosition={position} value={item.props.id} content={item} />
}

export default DraggableListItems