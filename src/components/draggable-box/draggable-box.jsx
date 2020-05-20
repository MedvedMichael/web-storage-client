import * as React from 'react';
import DraggableItemWrapper from '../drag-n-drop/draggable-item-wrapper';
import './draggable-box.css'

const DraggableBox = ({content,value,itemPosition, onItemDeleted}) => {
  
  return (
    <DraggableItemWrapper draggableId={value} index={itemPosition}>
      
      <div className="card draggable-box">
        <div className="delete-item-button">
          <button className="close" type="button" data-dismiss="modal" aria-label="Close" onClick={()=>onItemDeleted(value)}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div>{content}</div>
      </div>
    </DraggableItemWrapper>
  )
}

export default DraggableBox