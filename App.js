import React from 'react';
import { View, Image, Text, StyleSheet, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import MapView from 'react-native-maps';
import CustomCallout from './components/CustomCallout';
import { Button } from 'native-base';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isModalVisible: false,
      region: {
        latitude: 37.78825,
        longitude: -84.386330,
        latitudeDelta: 0,
        longitudeDelta: 0,
      },
      markers: []
    }
  }

  closeModal = () => this.setState({ isModalVisible: false })  

  componentDidMount() {
    return fetch('https://serene-scrubland-62943.herokuapp.com/api/places?limit=50')
    .then((response) => response.json())
    .then((resJson) => {
      let dbArr = [];
      resJson.data.forEach((item) => {
        dbArr.push({
          key: item.id,
          name: item.name,
          street: item.street,          
          city: item.city,
          state: item.state,
          zip: item.zip,                            
          description: item.description,
          coordinate:{
            latitude: item.latitude,
            longitude: item.longitude
          },
          image: item.image,
        })
      });
      this.setState({markers: dbArr})
    })
    .catch((error) => {
      console.error(error);
    })
  }

  render() {
    return (
      <View style={styles.holder}>
        <MapView
            style={styles.map}
            initialRegion={ this.state.region }
            onRegionChange={ this.onRegionChange }>
          {this.state.markers.map(marker => (
            <MapView.Marker
              key={marker.key}
              coordinate={marker.coordinate}
              title={marker.name}
              pinColor={'#605856'}>
              <MapView.Callout tooltip={true} style={styles.customView} 
                onPress={ () => this.setState({
                  name: marker.name,
                  street: marker.street,
                  city: marker.city,
                  state: marker.state,
                  zip: marker.zip,
                  description: marker.description,
                  image: marker.image,
                  isModalVisible: true
                })}>
                <CustomCallout>
                  <Image source={{uri: marker.image}} style={styles.faceStyle}/>
                  <Button rounded style={styles.ovalStyle}>
                    <Text style={styles.callText}>{marker.name}</Text>
                  </Button>                
                </CustomCallout>
              </MapView.Callout>
            </MapView.Marker>
          ))}
        </MapView>
        <Modal 
          isVisible={this.state.isModalVisible}
          onBackdropPress={this.closeModal}
          style={styles.boxStyle}>
          <View style={styles.modalStyle}>
            <View style={styles.oneRow}>
              <Image source={{uri: this.state.image}} style={styles.modalImage}/>
              <View style={styles.oneColumn}>
                <Text style={styles.callText}>{this.state.name}</Text>
                <Text style={styles.modalHeader}>{this.state.street}</Text>
                <Text style={styles.modalHeader}>{this.state.city}, {this.state.state}</Text>
                <Text style={styles.modalHeader}>{this.state.zip}</Text>
              </View>
            </View>
            <View style={styles.dividerStyle}/>      
            <Text style={styles.modalText}>{this.state.description}</Text>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalStyle: {
    backgroundColor: '#19a462'
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  holder: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  marker: {
    width: 5,
    height: 5
  },
  faceStyle: {
    width: 50, 
    height: 50, 
    padding: 10
  },
  callText: {
    fontWeight: 'bold',
    color: '#F2F2F2',
    textAlign: 'center',
    padding: 5
  },
  ovalStyle: {
    backgroundColor: "#3E3E3E"
  },
  modalText: {
    color: '#F2F2F2',
    textAlign: 'center',
    paddingTop: 5,
    paddingRight: 10,
    paddingLeft: 10,
    paddingBottom: 20
  },
  modalImage: {
    width: 100,
    height: 100
  },
  oneRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10
  },
  oneColumn: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15
  },
  modalHeader: {
    color: '#3E3E3E',
    padding: 3
  },
  dividerStyle: {
    borderBottomColor: '#1C6E8C',
    borderBottomWidth: 2,
    marginLeft: 10,
    marginRight: 10
  }
});
