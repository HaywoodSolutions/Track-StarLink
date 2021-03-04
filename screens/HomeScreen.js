import React from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapConfig from '../constants/MapConfig';
import { parseTLE } from '../lib/util';
import Satellite from '../lib/Satellite';
import StarlinkSats from '../constants/StarlinkSats';

const apiKey = "BH8Q23-XA3BM6-6CNF7X-486Q";

const sterlights = 44259;

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.region = {
      latitude: 0,
      latitudeDelta: 0,
      longitude: 0,
      longitudeDelta: 0,
    };

    this.satellites = [];

    this.state = {
      satellites: [],
      loaded: false
    }

  }
  
  componentDidMount() {
    this.satellites = [];
    Promise.all(StarlinkSats.map((sat) => {
      return fetch(`https://www.n2yo.com/sat/gettle.php?s=${sat[1]}`).then((data) => {
        return data.json();
      }).then((json) => {
        this.satellites.push(new Satellite(parseTLE(`${sat[0]}\n${json[0]}\n${json[1]}`)[0]));
        return 1
      });
    })).then((out) => {
      this.setState({
        loaded: out,
        number: out.length
      });
      console.log("Loaded")
    }) ;

    // this.interval = setInterval(() => {
    //   this.satellites.forEach(sat => sat.refresh());
    // }, 2000);
  }

  componentWillUnmount() {
    //this.interval();
  }

  /*
  onRegionChange(region) {
    this.region = region;
    let list = [];
    console.log(this.satellites[0] && this.satellites[0].position ||null, region);
    for (var i=0; i<this.satellites.length; i++) {
      let diffLat = Math.abs(this.satellites[i].position.latitude - region.latitude);
      let diffLng = Math.abs(this.satellites[i].position.longitude - region.longitude);
      if (diffLat <= region.latitudeDelta / 2 && diffLng <= region.longitudeDelta / 2)
        list.push(i);
    }
    list.sort();
    console.log(list.length)
    if (!arraysEqual(this.state.satellites, list))
      this.setState({
        satellites: list
      });
  }
  */

  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.mapStyle}
          customMapStyle={MapConfig}
          maxZoomLevel={5}
          ref={(ref) => this.mapRef = ref}
          rotateEnabled={false}
          onRegionChange={this.onRegionChange}
        >
          {
            this.state.satellites.map((_, id) => (
              <Marker
                key={id}
                image={require('../assets/images/StarlinkLogo.png')}
                coordinate={this.satellites[id].position || {latitude: 0, longitude: 0}}
                title={this.satellites[id].orbit && this.satellites[id].orbit.title || ""}
              />
            ))
          }
        </MapView>
      </View>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  }
});