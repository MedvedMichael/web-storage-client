import * as React from 'react';
import DraggableItemWrapper from '../drag-n-drop/draggable-item-wrapper';
import './draggable-box.css'
import WrapperCard from '../wrapper-card/wrapper-card';

const DraggableBox = ({content,value,itemPosition, onItemDeleted}) => {
  const closeButton = (
    <div className="delete-item-button">
      <button className="close" type="button" data-dismiss="modal" aria-label="Close" onClick={() => onItemDeleted(value)}>
        <span aria-hidden="true">&times;</span>
      </button>
    </div>)
  return (
    <DraggableItemWrapper draggableId={value} index={itemPosition}>
      
      <div className="draggable-box">
        
        <WrapperCard header={closeButton}>
          
          <div>{content}</div>
        </WrapperCard>
      </div>

    </DraggableItemWrapper>
  )
}

export default DraggableBox