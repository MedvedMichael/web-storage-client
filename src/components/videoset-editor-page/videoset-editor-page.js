import React, { Component } from 'react';
import PictureSlider from '../picture-slider/picture-slider';
import WebStorageService from '../../services/web-storage-service';
import EditorContext from '../drag-n-drop/editor-context';
import VerticalColumn from '../vertical-column/vertical-column';
import VideosetDescription from '../videoset-description/videoset-description';
import EditorBar from '../editor-bar/editor-bar'
import VideosModule from '../videos-module/videos-module';
import './videoset-editor-page.css'

export default class VideosetEditorPage extends Component {

    webStorageService = new WebStorageService()
    
    state = {
        data: null,
        startData :null,
        columnId:0,
        itemList:[],
        videosetId:null,
        counters: {

        }
    }

    onDragEnd = async (result) => {
        const { destination, source } = result;
    
        if (!destination) { return }
    
        const {itemList, data} = this.state;
        const movedPart = itemList.splice(source.index,1)[0];
        itemList.splice(destination.index,0,movedPart)
        const movedItem = data.order.splice(source.index,1)[0]
        data.order.splice(destination.index,0,movedItem)
        this.setState({itemList,data})
        console.log(data.order)
        const updating  = await this.webStorageService.patchVideoset(this.props.id,{order:data.order})
        console.log(updating)
     
      }

    async componentDidMount() {
        const { id } = this.props
        const {getVideoset, getSubcategory} = this.webStorageService
        const videosetData = await getVideoset(id)
        const subcategoryData = await getSubcategory(videosetData.owner)
        this.setState({ videosetId: id, data: videosetData, startData: videosetData, subcategoryData })
        
        
        console.log(videosetData)
        this.initialAddingItems()
        // console.log(subcategoryData)
        // const pictures = [
        //     'https://s3.tproger.ru/uploads/2017/04/11-js-tricks-880x308.png',
        //     'https://tech-geek.ru/wp-content/uploads/javascript-security.jpg',
        //     'https://techrocks.ru/wp-content/uploads/2017/11/JS_answers_1.jpg']

        
        // this.addItemToColumn(PictureSlider, { dataURLs: pictures, editable:true, uploadingPictures:this.uploadingPictures })
        // this.addItemToColumn(VideosetDescription,{text:"If you were using 0.x versions: library was significantly rewritten for 1.x version and contains several breaking changes. The best way to upgrade is to read the docs and follow the examples.\n\nPlease note that the default footer parses HTML automatically (such as <b>I'm bold!</b>) but it does not implement any form of XSS or sanitisation. You should do that yourself before passing it into the caption field of react-images. \n Using the Carousel\n\nImport the carousel from react-images at the top of a component and then use it in the render function."})
        // this.addItemToColumn(Spinner)
        // this.addItemToColumn(VideosModule,{id})
    
    }

    initialAddingItems =  () => {
        
        const {data} = this.state
        const {description, order} = data
        data.order = []
        this.setState({data})
        order.forEach(async element => {
            if(element === 'VideosetDescription' && description){
                await this.addItemToColumn(VideosetDescription,{text:description, editable:true})
            }            
            else if(element === 'PictureSlider'){
                const dataURLs = await this.webStorageService.getPicturesOfVideoset(this.props.id)
                await this.addItemToColumn(PictureSlider,{dataURLs, editable:true, uploadingPicture:this.uploadingPicture, deletingPicture:this.deletingPicture})
            }
        });
        
    }

    uploadingPicture = async (id,slideIndex, pictures) => {
        const res = await this.webStorageService.postPictures(this.state.data.id, pictures)
        if (!res.ok)
            return
        
        const dataURLs = await this.webStorageService.getPicturesOfVideoset(this.props.id)
        const { itemList } = this.state
        const indexOfElement = itemList.findIndex((item) => item.props.id === id);

        const newSlider = <PictureSlider {...itemList[indexOfElement].props} dataURLs={dataURLs} slideIndex={slideIndex}/>
        itemList[indexOfElement] = newSlider

        this.setState({itemList})
    }

    deletingPicture = async (id, slideIndex, path) => {
        const {itemList} = this.state
        let i = path.length - 1
        while (path[i] !== '/') i--
        const pictureId = path.substring(i + 1)

        const res = await this.webStorageService.deletePhoto(pictureId)

        if (res.error)
            return

        const dataURLs = await this.webStorageService.getPicturesOfVideoset(this.props.id)

        const indexOfElement = itemList.findIndex((item) => item.props.id === id);
        const newSlider = <PictureSlider {...itemList[indexOfElement].props} dataURLs={dataURLs} slideIndex={(slideIndex>0)?slideIndex-1:null} />
        itemList[indexOfElement] = newSlider

        this.setState({itemList})
    }


    addItemToColumn = async (ReactComponent, props = {}) => {
        const { data, itemList, counters } = this.state

        if (!counters[ReactComponent.name])
            counters[ReactComponent.name] = 0

        const counter = counters[ReactComponent.name]

        const newItem = <ReactComponent id={String(ReactComponent.name) + counter} {...props} />
        counters[ReactComponent.name] += 1
        itemList.push(newItem)
        // console.log(newList)
        data.order.push(ReactComponent.name)

        // data.order = []
        this.setState({
            data,
            itemList,
            counters
        })

        const updating  = await this.webStorageService.patchVideoset(this.props.id,{order:data.order})

        console.log(updating)
    
    }

    onVideosetElementAdded = (element) => {
        let ReactComponentName, props
        switch (element) {
            case 'Slider': 
                ReactComponentName = PictureSlider
                props = { editable: true, uploadingPicture:this.uploadingPicture, deletingPicture:this.deletingPicture  }
                break

            case 'Description': 
                ReactComponentName = VideosetDescription
                props = { text: this.state.data.description, editable: true}
                break

            case 'Videos':
                ReactComponentName = VideosModule
                props = {id:this.state.videosetId}
                break
            
            default:return
        }

        this.addItemToColumn(ReactComponentName,props)
    }

    onVideosetItemDeleted = async (id) => {
        const {data, itemList} = this.state
        const index = itemList.indexOf(itemList.find((item)=>item.props.id === id))
        itemList.splice(index,1);
        data.order.splice(index,1);
        this.setState({ data, itemList })
        await this.webStorageService.patchVideoset(this.props.id,{order:data.order})
        console.log(data.order)
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
                    <EditorBar onVideosetElementAdded={this.onVideosetElementAdded} />
                    <EditorContext onDragEnd={this.onDragEnd}>
                        <VerticalColumn id={columnId} items={itemList} onItemDeleted={this.onVideosetItemDeleted} />
                    </EditorContext>

                </div>
        )
    }

}
