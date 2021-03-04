import Orbit from './Orbit';
import TLE from './TLE';

module.exports = class Satellite {
  constructor(tle) {
    this.tle = tle;
    this.position = null;
    this.path = null;
    this.orbit = new Orbit(tle);
    this.date = null;    

    this.marker = this.markerOpts; // market
    this.horizon = this.horizonOpts; // circle
    this.polyline = this.polylineOpts; //polyline
    this.shadowPolylines = [];
  
    // check if we have TLE and init orbit
    if(this.tle !== null && !(this.tle instanceof TLE)) this.tle = null;
    if(this.tle !== null) this.setTLE(this.tle);
  
    // refresh
    this.refresh();
  }

  setTLE(tle) {
    this.orbit = new Orbit(tle);
    //this.marker.setTitle(tle.name);
  };

  refresh() {
    if(this.orbit === null) return;
  
    this.orbit.setDate(new Date());
    this.orbit.propagate();
    this.position = this.orbit.getLatLng();
    //this.marker.setPosition(this.position);
    var alt = this.orbit.getAltitude() * 1000;
    //this.horizon.setRadius(util.getDistanceToHorizon(alt));
  };

  refresh_path() {
    if(this.pathLength >= 1.0/180) this._updatePoly();
  };

  // _updatePoly() {
  //   var dt = (this.orbit.getPeriod() * 1000) / 180;
  //   var date = (this.date) ? this.date : new Date();
  //   this.path = [];
  //   this.shadowPolylines = [];
  //   var night = false;
  //   var curr_path = [];
  //   var curr_poly = null;
  //   var curr_date = null;
  //   var curr_night = null;
  
  //   var i = 0;
  //   var jj = (180 * this.pathLength) + 1;
  //   for(; i <= jj; i++) {
  //       curr_date = new Date(date.getTime() + dt*i);
  //       this.orbit.setDate(curr_date);
  //       this.orbit.propagate();
  //       var pos = this.orbit.getLatLng();
  //       this.path.push(pos);
  
  //       if(!this.drawShadowPolylines) continue;
  
  //       var dist = google.maps.geometry.spherical.computeDistanceBetween(util.calculateLatLngOfSun(curr_date), pos);
  //       curr_night = dist > util.halfEarthCircumference + util.getDistanceToHorizon(this.orbit.getAltitude() * 1000);
  
  //       if(night === true && curr_night === true) {
  //           curr_path.push(pos);
  //       }
  //       else if(night === true && curr_night === false) {
  //           curr_poly.setPath(curr_path);
  //       }
  //       else if(night === false && curr_night === true) {
  //           curr_poly = new google.maps.Polyline(this.shadowPolylinesOpts);
  //           this.shadowPolylines.push(curr_poly);
  
  //           curr_path = [pos];
  //       }
  //       night = curr_night;
  //   }
  
  //   if(night) curr_poly.setPath(curr_path);
  
  //   this.polyline.setPath(this.path);
  // };
}