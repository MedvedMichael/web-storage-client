import React, { Component } from 'react';
import './videoset-description.css'
class VideosetDescription extends Component{

    state = {
        text:'',
        editable:false,
        editableText:'',
        editableTitle:'',
        editStatus:false
    }

    componentDidMount = () => {
        const {text, editable} = this.props

        this.setState({ text: (text) ? text : '&&&', editable: (editable) ? editable : false })
    }

    componentDidUpdate = (prevProps) => {
        if(this.props.text !== prevProps.text){
            this.setState({text:this.props.text})
        }
    }

    onSaveClick = () => {
        const {editableText, editableTitle} = this.state
        const newText = (editableTitle!=='' ? editableTitle : 'Description') + "&&&" + editableText
        this.setState({ text: newText, editStatus: false })
        this.props.saveDescription(this.props.id, newText)
    }

    onChangeClick = () => {
        const {editStatus,text} = this.state
        const newStatus = !editStatus
        const [titleText, mainText] = text.split('&&&')
        this.setState({ editStatus: newStatus, editableText: mainText, editableTitle: titleText })
    }
    render() {
        const { editable, editableText, editStatus, text, editableTitle } = this.state
        const [titleText, mainText] = text.split('&&&')
        const title = !editStatus ? <h3 className="text-success"> {titleText && titleText !== "" ? titleText : "Description"}: </h3>
            : <textarea className="form-control edit-title-area" rows="1" onChange={({ target }) => { this.setState({ editableTitle: target.value }) }} value={editableTitle}></textarea>
            
        const textField = (
            <div className="form-group text-field">
                <textarea className="form-control edit-text-area" rows="3" onChange={({ target }) => { this.setState({ editableText: target.value }) }} value={editableText}></textarea>
                <div className="btn-group">
                    <button type="button" className="btn btn-success save-btn" onClick={() => { this.onSaveClick() }}>Save changes</button>
                    <button type="button" className="btn btn-secondary save-btn" data-dismiss="modal" onClick={() => this.setState({ editStatus: !this.state.editStatus })}>Close</button>
                </div>
            </div>)

        const changeButton = (editable) ? (
            <div className="change-btn">
                <button type="button" className="btn btn-outline-success btn-lg" onClick={() => { this.onChangeClick() }}>Change</button>
            </div>) : null

        const linesOfDescription = !mainText ? "" : mainText.split('\n').map((item, index) => <h4 key={`description-line${index}`} className="description">{item}</h4>);
        
        const description = (
            <div className="card-body">
                {(editStatus)?textField:(linesOfDescription)}
            </div>)


        return (
            <div className="videoset-description">
                <Row left={title} right={description} />
                <div>
                    {(!editStatus) ? changeButton : null}
                </div>
            </div>)
    }
}
const Row = ({ left, right }) => {
    const width = `row-item`;
    return (
        <div className="row mb2">
            <div className={width}>
                {left}
            </div>
            <div className="col-md-9">
                {right}
            </div>
        </div>
    )
}

export default VideosetDescription