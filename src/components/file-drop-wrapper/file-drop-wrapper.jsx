import React, {useState} from 'react';
import './file-drop-wrapper.css'
const FileDropWrapper = ({editable, children, onFilesAdded}) => {

    const [highlight, setHighlight] = useState(false)
    console.log("HI" + highlight)
    
    const onDragEnter = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setHighlight(true)
        console.log(highlight)
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
        console.log(highlight)
    }
    const onDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        // console.log("drop")
        setHighlight(false)
        // console.log(e.dataTransfer)
        
        onFilesAdded(e.dataTransfer)
    }

    const className = `card drop-area ${highlight?'highlight border-success':''}`
    return (!editable) ? (<div>{children}</div>) : (
        <div className={className} onDragEnter={onDragEnter} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
            {children}
        </div>
    )
}

export default FileDropWrapper