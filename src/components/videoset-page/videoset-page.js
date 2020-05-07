import React, { Component } from 'react';
import Spinner from '../spinner';
import PictureSlider from '../picture-slider/picture-slider';
import WebStorageService from '../../services/web-storage-service';
import './videoset-page.css'
import EditorContext from '../drag-n-drop/editor-context';
import VerticalColumn from '../vertical-column/vertical-column';
export default class VideosetPage extends Component {

    webStorageService = new WebStorageService()

    
    state = {
        data: null,
        columnId:0,
        itemList:[]
    }

    onDragEnd = (result) => {
        const { destination, source, draggableId } = result;
    
        if (!destination) { return }

        console.log(result)
    
        const {itemList} = this.state;
        console.log(itemList)
        const movedPart = itemList.splice(source.index,1)[0];
        itemList.splice(destination.index,0,movedPart)

        
        this.setState({itemList})
        
        // this.setState({itemList})

        
      }

    componentDidMount() {
        const { id, getData } = this.props
        getData(id).then((data) => {
            this.setState({ data })
        }).catch((err) => {
            console.log(err)
        });

        this.initItemList()
    }

    initItemList = () => {
        const slider = () => (
            <div id="slider">
                <PictureSlider
                    dataURLs={['https://s3.tproger.ru/uploads/2017/04/11-js-tricks-880x308.png',
                        'https://tech-geek.ru/wp-content/uploads/javascript-security.jpg',
                        'https://techrocks.ru/wp-content/uploads/2017/11/JS_answers_1.jpg']} />
            </div>)

        const spinner = (id) => (
            <div id={id}>
                <Spinner />
            </div>
        )

        const itemList = [spinner("1"), slider(), spinner("2")]
        this.setState({itemList})
    }

    render() {
        const { data, columnId, itemList } = this.state
    
        if (!data)
            return null

        // const { name, description } = this.state.data
        

        return (
            <div className="videoset">
                <h1 className="videoset-title">
                    {}
                </h1>
                <EditorContext onDragEnd={this.onDragEnd}>
                    <VerticalColumn id={columnId} items={itemList} />
                </EditorContext>

            </div>
        )
    }
}