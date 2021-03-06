import React, { Component } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import { GOOGLE_API_KEY } from 'react-native-dotenv'
import DisplayLocation from './DisplayLocation'
import Searchbar from './Searchbar'
import HamburgerMenu from './HamburgerMenu'


export default class MapPage extends Component {
  state = {
    location: {},
    errorMessage: "",
    data: []
  };

  componentDidMount = () => {
    fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=39.7465108,-104.9968927&radius=1500&type=parking&key=${GOOGLE_API_KEY}`)
      .then(res => res.json())
      .then(res => this.setState({
        data: res.results
      }))
  }

  componentDidUpdate(prevProps, prevState){
    if (this.state.location !== prevState.location){
      fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.state.location.coords.latitude},${this.state.location.coords.longitude}&radius=1500&type=parking&key=${GOOGLE_API_KEY}`)
      .then(res => res.json())
      .then(res => this.setState({
        data: res.results
      }))
    }
  }

  componentWillMount() {
    this.getLocation();
  }

  getLocation = async () => {
    const { status } = Permissions.askAsync(Permissions.LOCATION);

    if (status !== "granted") {
      console.log("Permission not granted!");

      this.setState({
        errorMessage: "Permission not granted!",
      });
    }
    const location = await Location.getCurrentPositionAsync();
    console.log(location)

    this.setState({
      location,
    });
  };

  showMarkers = () => {
    return this.state.data.map((data) => {
      return <Marker 
        coordinate={{
          latitude: data.geometry.location.lat,
          longitude: data.geometry.location.lng,
        }}
        key={data.id}
        title={data.name}
        >
        <Image 
          source={require('../../assets/pmarker.png')} 
          style={{height: 50, width:50 }} 
        />
        </Marker> 
    })
  }


  changeLocation = (newLocation) => {
    this.setState({location: newLocation})
    
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 0.4}}>  
          <Searchbar changeLocation={this.changeLocation}/>   
        </View>
        {this.state.location.coords ? 
        <View style={{flex: 1, marginTop: 30}}>
          <MapView
            region={{
              latitude: this.state.location.coords.latitude,
                longitude: this.state.location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              style={styles.mapview}
              > 
              {this.showMarkers()}
            </MapView>
          </View>
          :<Image
              source={require('../../assets/loading4.gif')}
              style={{height: 500, width:500 }}
          />}
        <View style={{flex: 1}}>
          <DisplayLocation key={this.state.data.id} style={styles.displayContainer} data={this.state.data}/>
        </View>
      </View>
        <View style={styles.container}>
          {this.state.location.coords ? 
          <MapView
          region={{
            latitude: this.state.location.coords.latitude,
              longitude: this.state.location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            style={styles.mapview}
            > 
            {this.showMarkers()}
          </MapView>:<Image
              source={require('../../assets/loading4.gif')}
              style={{height: 500, width:500 }}
              />}
        <View>     
          <DisplayLocation style={styles.displayContainer} data={this.state.data}/>
        </View>
        <View>
          {/* <Text>Hello</Text> */}
           {/* <Searchbar/> */}
        </View>
        </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  mapview: {
    flex: 1,
    width: 400,
    height: 400,
  },
  
  displayContainer: {
    height: 1000,
  },

});


