import React, { Component } from 'react';
import PictureSlider from '../picture-slider/picture-slider';
import WebStorageService from '../../services/web-storage-service';
import './videoset-page.css'
import EditorContext from '../drag-n-drop/editor-context';
import VerticalColumn from '../vertical-column/vertical-column';
import VideosetDescription from '../videoset-description/videoset-description';
import EditorBar from '../editor-bar/editor-bar'
import VideosModule from '../videos-module/videos-module';
export default class VideosetPage extends Component {

    webStorageService = new WebStorageService()
    
    state = {
        data: null,
        columnId:0,
        itemList:[],
        videosetId:null,
        counters: {

        }
    }

    onDragEnd = (result) => {
        const { destination, source } = result;
    
        if (!destination) { return }
    
        const {itemList} = this.state;
        const movedPart = itemList.splice(source.index,1)[0];
        itemList.splice(destination.index,0,movedPart)
   
        this.setState({itemList})
     
      }

    async componentDidMount() {
        const { id } = this.props
        const {getVideoset, getSubcategory} = this.webStorageService
        const videosetData = await getVideoset(id)
        const subcategoryData = await getSubcategory(videosetData.owner)
        this.setState({videosetId:id,data:videosetData, subcategoryData})
        console.log(videosetData)
        this.initialAddingItems()
        // console.log(subcategoryData)
        // const pictures = [
        //     'https://s3.tproger.ru/uploads/2017/04/11-js-tricks-880x308.png',
        //     'https://tech-geek.ru/wp-content/uploads/javascript-security.jpg',
        //     'https://techrocks.ru/wp-content/uploads/2017/11/JS_answers_1.jpg']

        
        // this.addItemToColumn(PictureSlider, { dataURLs: pictures })
        // this.addItemToColumn(VideosetDescription,{text:"If you were using 0.x versions: library was significantly rewritten for 1.x version and contains several breaking changes. The best way to upgrade is to read the docs and follow the examples.\n\nPlease note that the default footer parses HTML automatically (such as <b>I'm bold!</b>) but it does not implement any form of XSS or sanitisation. You should do that yourself before passing it into the caption field of react-images. \n Using the Carousel\n\nImport the carousel from react-images at the top of a component and then use it in the render function."})
        // this.addItemToColumn(Spinner)
        this.addItemToColumn(VideosModule,{id})
    
    }

    initialAddingItems = () => {
        const {description, order} = this.state.data

        order.forEach(element => {
            if(element === 'VideosetDescription' && description){
                this.addItemToColumn(VideosetDescription,{text:description})
            }

            
        });
        
    }



    addItemToColumn = (ReactComponent, props = {}) => {
        const { data, itemList, counters } = this.state

        if (!counters[ReactComponent.name])
            counters[ReactComponent.name] = 0

        const counter = counters[ReactComponent.name]

        const newItem = <ReactComponent id={String(ReactComponent.name) + counter} {...props} />
        counters[ReactComponent.name] += 1
        itemList.push(newItem)
        // console.log(newList)

        data.order.push(ReactComponent.name)


        this.setState({
            data,
            itemList,
            counters
        })
        console.log(data)
    
    }

    onVideosetElementAdded = (element) => {
        let ReactComponentName, props
        switch (element) {
            case 'Slider': 
                ReactComponentName = PictureSlider
                break

            case 'Description': 
                ReactComponentName = VideosetDescription
                props = {text:this.state.data.description, editable:true}
                break

            case 'Videos':
                ReactComponentName = VideosModule
                props = {id:this.state.videosetId}
                break
            
            default:return
        }

        this.addItemToColumn(ReactComponentName,props)
    }

    onVideosetItemDeleted = (id) => {
        const {data, itemList} = this.state
        const index = itemList.indexOf(itemList.find((item)=>item.props.id === id))
        itemList.splice(index,1);
        data.order.splice(index,1);
        this.setState({ data, itemList })
    }
    

    render() {
        const { data, columnId, itemList } = this.state
    
        if (!data)
            return null
        const {name} = data

        return (
            <div className="videoset">
                <h1 className="videoset-title">
                    {name}
                </h1>
                <EditorBar onVideosetElementAdded={this.onVideosetElementAdded}/>
                <EditorContext onDragEnd={this.onDragEnd}>
                    <VerticalColumn id={columnId} items={itemList} onItemDeleted={this.onVideosetItemDeleted} />
                </EditorContext>
                
            </div>
        )
    }

}
