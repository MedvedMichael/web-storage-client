import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';


const DraggableItemWrapper = ({ draggableId, index, className, children }) =>
  <Draggable draggableId={draggableId} index={index}>
    {({innerRef,draggableProps,dragHandleProps}) => (
      <div className={className} ref={innerRef} {...draggableProps} {...dragHandleProps}>
        {children}
      </div>
    )}
  </Draggable>

export default DraggableItemWrapper