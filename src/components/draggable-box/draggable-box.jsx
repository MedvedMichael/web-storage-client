import * as React from 'react';
import DraggableItemWrapper from '../drag-n-drop/draggable-item-wrapper';
import './draggable-box.css'

const DraggableBox = (props) => {
  
  return (
    <DraggableItemWrapper draggableId={props.value} index={props.itemPosition}>
      <div className="card draggable-box">
        <div>{props.content}</div>
      </div>
    </DraggableItemWrapper>
  )
}

export default DraggableBox