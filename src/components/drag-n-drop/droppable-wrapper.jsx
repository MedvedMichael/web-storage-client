import * as React from 'react';
import { Droppable } from 'react-beautiful-dnd';

const DroppableWrapper = ({droppableId,className,children}) =>
{
  console.log(droppableId, className, children)
  return (
  <Droppable droppableId={droppableId}>
    {({innerRef,droppableProps,droppablePlaceholder}) => (
       <div className={className}
            ref={innerRef}
            {...droppableProps}
            {...droppablePlaceholder}>
          {children}
        </div>
    )}
  </Droppable>)
}

export default DroppableWrapper