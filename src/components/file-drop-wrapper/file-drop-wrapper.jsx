import React, {useState} from 'react';
import './file-drop-wrapper.css'
const FileDropWrapper = ({editable, children, onFilesAdded, extraClassName}) => {

    const [highlight, setHighlight] = useState(false)
    
    
    const onDragEnter = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setHighlight(true)
        
    }
    const onDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setHighlight(true)
    }
    const onDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setHighlight(false)
    }
    const onDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setHighlight(false)
        
        onFilesAdded(e.dataTransfer)
    }
    const className = `card drop-area ${(extraClassName&&!highlight)?extraClassName:''} ${highlight?'highlight border-success':''}`
    return (!editable) ? (<div>{children}</div>) : (
        <div className={className} onDragEnter={onDragEnter} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
            {children}
        </div>
    )
}

export default FileDropWrapper