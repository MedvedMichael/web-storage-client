import * as React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';


const EditorContext = (props) =>
  <div className="editor">
    <DragDropContext onDragEnd={props.onDragEnd} {...props} />
  </div>

export default EditorContext