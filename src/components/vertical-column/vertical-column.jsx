import * as React from 'react';
import DroppableWrapper from '../drag-n-drop/droppable-wrapper';
import DraggableListItems from '../drag-n-drop/draggable-list-items';

const VerticalColumn = ({id,items}) =>
{
  id = String(id)
  return (
  <DroppableWrapper droppableId={id} className="source">
    <DraggableListItems items={items} />
  </DroppableWrapper>)
}

export default VerticalColumn