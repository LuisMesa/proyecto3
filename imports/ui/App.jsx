import React, { Component, PropTypes } from 'react';
//import './App.css';
import Image from './image';
import Features from './features';
import Comments from './comments';
import VideoPlayer from './videoPlayer';
import ReactDOM from 'react-dom';
import axios from 'axios';
import YTSearch from 'youtube-api-search';
import {Comentarios} from '../api/Back.js';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import { createContainer } from 'meteor/react-meteor-data';
import Comparacion from './comparacion.jsx';
import {Comparaciones} from '../api/comparaciones.js';
import { Meteor } from 'meteor/meteor';

const API_KEY = 'AIzaSyD7AeJ_fi01jWanRgPibiUCgWuSFb7nFkE';
class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selected: false,
            brands: [],
            videosA: [],
            videosB: [],
            selectedA: null,
            selectedB: null,
            contador:0,
            comments:[],
            insertado: false
        };
    }
getComp1(){
var fullarray = [this.state.selectedA, this.state.selectedB];
return fullarray;
}


renderComp()
{
var array= this.getComp1();
  if (array[0]== null || array[1]==null)
  {
   return;
  }
  if(this.state.insertado===false)
  {
      const Itemid1 =array[0].itemId;
      const name1 =array[0].name;

      const price1 = array[0].salePrice;
      var des1 = array[0].shortDescription;
      const Itemid2 =array[1].itemId;
      const name2 =array[1].name;
      var des2 = array[1].shortDescription;
      const price2 = array[1].salePrice;
      if( array[0].shortDescription===null)
      {
          des1="No disponible";
      }
      if(array[1].shortDescription===null )
      {
          des2="No disponible";
      }

      Meteor.call('comparaciones.insert', Itemid1, name1, des1, price1, Itemid2, name2, des2, price2);

      this.state.insertado=true;
  }



  return this.props.comparaciones.map((comparacion) => (
  <Comparacion key= {comparacion.itemId} comparacion={comparacion}/>
  ))

}




    getObjetos(keyword) {
        this.state.data = [];
        this.state.selected = true;
        this.state.contador=0;
        Meteor.call("walmart.search", keyword, (err, res) => {
        if (err) { console.log(err); }
        console.log("made it!");
        console.log(res.items);
        this.setState({data: res.items});
      });
        console.log(this.state.data);
        console.log(this.state.brands);
        console.log(this.state.selected);
    }


    buscarVideoYoutubeA(term) {
        YTSearch({key: API_KEY, term: term}, (videos) => {
            this.setState({
                videosA: videos[0]
            });
        });
    }

    buscarVideoYoutubeB(term) {
        YTSearch({key: API_KEY, term: term}, (videos) => {
            this.setState({
                videosB: videos[0]
            });
        });
    }


    showInstructions() {
        if (this.state.selected == true) {
            return (
                <div className="instruction">
                    <h3>Selecciona los dos objetos que vas a comparar </h3>
                </div>
            );
        }
    }
    recomendacionUltimoP( )
    {
        var ultimo = Comparaciones.find().limit(1).sort({$natural:-1})
    }

    loggedin() {
        if (Meteor.currentUser!==null)
        {
            return(
                    <div className="col-md-8 center comentarios">
                    <input type="text" id="comments" className="form-control" placeholder="escribe..." />
                        <br/>
                    <button id="botonComments" className="btn btn-success btn-block" onClick={()=> this.comment()}>
                        Comentar
                    </button>
                        <br/>
                    <Comments comments={this.state.comments}/>
                    </div>
            );
        }else {
            return(
                <div className="col-md-8 center comentarios">
                <p>Por favor inicie sesion para usar esta función</p>
                </div>
                );

        }
    }

    showOptions(){
        if (this.state.contador<2) {
            this.state.selected=false;
            return (
                <div className="row">
                    <div className="col-md-2"></div>
                    <div className="col-md-8">
                        {this.state.data.map(image => {
                            return (
                                <div className="producto">
                                    <Image producto={image} callFather={(producto)=> this.childChanged(producto)}/>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }
        return (<div><h2 className="center">Comparar</h2></div>);
    }

    childChanged(producto){
        if(this.state.selectedA === null){
            this.setState({
                selectedA:producto
            });
            this.state.contador=1;
        }else {
            this.setState({
                selectedB:producto
            });
            this.state.contador=2;
        }
    }

    comment(){
        if(document.getElementById("comments").value !== null){
            var text = document.getElementById("comments").value;
            var arrayC = this.state.comments;
            arrayC.push(text);
            this.setState({comments:arrayC});
            document.getElementById("comments").value = "";
        }
    }



    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-2"></div>
                    <div className="col-md-8">

                        <br></br>
                        <AccountsUIWrapper />
                        <input type="text" id="text" className="form-control" placeholder="busca el objeto a comparar"/>
                        <br></br>
                        <div className="row">

                            <div className="col-md-2"></div>
                            <div className="col-md-8">
                                <button className="btn btn-info btn-block" onClick={(evt) => {
                                    this.getObjetos(document.getElementById("text").value)
                                }}>
                                    buscar productos
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <br></br>

                <p>{this.showInstructions()}</p>
                <p>{this.showOptions()}</p>

                <div className="row">
                <div className="col-md-2"></div>
                <div className="col-md-4 center">
                    <Features detalles={this.state.selectedA}/>
                    <VideoPlayer />
                </div>
                <div className="col-md-4 center">
                    <Features detalles={this.state.selectedB} />
                    <VideoPlayer/>
                </div>
                <div className="col-md-2"></div>
                </div>
                <br/>
                <br/>
                <div className="antesComment"><br></br><h2>Cuentanos de tu experiencia</h2></div>
                <br></br><br></br><br></br>
                <div className="row">
                <div className="col-md-2"></div>
                <p class="center">{this.loggedin()}</p>
   { this.props.currentUser ?
<ul>
                {this.renderComp()}
</ul> : ''
                }
                </div>
            </div>
        );
    }
}
App.propTypes = {
comparaciones: PropTypes.array.isRequired,
incompleteCount: PropTypes.number.isRequired,
 currentUser: PropTypes.object,

};

export default createContainer (() => {

    Meteor.subscribe('comparaciones');
return {

comparaciones: Comparaciones.find({}).fetch(),
incompleteCount: Comparaciones.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
    };
},App);
