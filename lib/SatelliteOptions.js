export default {
  tle: "",
  title: null,
  pathLength: 1,
  visible: true,
  map: null,
  markerOpts: {
      zIndex: 50,
  },
  horizonOpts: {
      radius: 0,
      zIndex: 10,
      strokeWeight: 2,
      strokeColor: "white",
      strokeOpacity: 0.8,
      fillColor: "white",
      fillOpacity: 0.2,
  },
  polylineOpts: {
      zIndex: 20,
      geodesic: true,
      strokeWeight: 2,
      strokeColor: "blue",
      strokeOpacity: 0.8
  },
  drawShadowPolylines: true,
  shadowPolylinesOpts: {
      zIndex: 20,
      geodesic: true,
      strokeWeight: 5,
      strokeColor: "blue",
      strokeOpacity: 0.8
  },
};