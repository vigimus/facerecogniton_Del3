import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin/';
import Register from './components/Register/Register/';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import ParticlesBg from 'particles-bg'
import Clarifai from 'clarifai';

//Behövs så att Clarifai apn fungerar som den ska
const app = new Clarifai.app({
apiKey: '73819cb0c7e640e8b82e30c4ecaf05d3'
});

class App extends Component {
constructor() {
    super();
    this.state = {
      input: ' ', 
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
      id: '',
      name: '',
      password: "",
      email: ''
      entries: 0, 
      joined:''
      }
    }
  }


loadUser = (data) =>  {
  this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries, 
      joined: data.joined
  }})
}
  
  calculateFaceLocation = (data) => {
  //vi behöver printa ut bounding_box variabeln
const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
const image = document.getElementById('inputimage');
const width = Number(image.width);
const height = Number(image.height);
return {
  leftCol: clarifaiFace.left_col * width,
  topRow: clarifaiFace.top_row * height,
  rightCol: width - (clarifaiFace.right_col * width),
  bottomRow: height - (clarifaiFace.bottom_row * height)
  }
}

displayFaceBox = (box) => {
  this.setState({box: box});
}

//Knappar som använts för att skicka in en bild och den ska läsas av
onInputChange = (event) => {
 this.setState({input: event.target.value});
  }

onButtonSubmit = () => {
this.setState({imageUrl: this.state.input});
  app.models
   //Läser specifikt av andras ansikten i en bild
  .predict(
    Clarifai.FACE_DETECT_MODEL,
    this.state.input)
     .then(response => {
      if (response) {
        fetch('http://localhost:3000/image' , {
          method: 'put',
          headers: {'Content-Type ': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count}))
        })
      }
      this.displayFaceBox(this.calculateFaceLocation(response))});
}

onRouteChange = (route) => {
  if (route === 'signout') {
    this.setState({isSignedIn: false})
  } else if (route === 'home ') {
    this.setState({isSignedIn: true})
  }
  this.state({route: route});
}

  render() {
  return (
    <div className="App">
        <div>...</div>
        <ParticlesBg className='particles' type="circle" bg={true} />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
        { this.state.route === 'home' 
        ? <div>
        <Logo />
        <Rank />
        <ImageLinkForm 
        onInputChange={this.onInputChange}
        onButtonSubmit={this.onButtonSubmit} 
        />
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
        </div>
        : (
this.state.route ==='signin' ?
<Signin onRouteChange={this.onRouteChange}/>
: <Register loadUser={this.loadUser}  onRouteChange={this.onRouteChange}/>
          )
      }
    </div>
  );
  }
}
export default App;

