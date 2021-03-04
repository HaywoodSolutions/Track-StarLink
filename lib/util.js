import TLE from './TLE';

/**
* merge two objects together, b takes precedence
* @param   {Object} a - First object instance
* @param   {Object} b - Second object instance
* @returns {Object}
*/
const mergeOpts = function(a, b) {
  var k, result = {};
  for(k in a) result[k] = a[k];
  for(k in b) result[k] = b[k];
  return result;
};

/**
* takes a Date instance and return julian day
* @param   {Date} date - Date instance
* @returns {float}
*/
const jday = function(date) {
  return (date.getTime() / 86400000.0) + 2440587.5;
};

/**
* takes a Date instance and returns Greenwich mean sidereal time in radii
* @param   {Date} date - Date instance
* @returns {float}
*/
const gmst = function(date) {
  var jd = jday(date);
  //t is the time difference in Julian centuries of Universal Time (UT1) from J2000.0.
  var t = (jd - 2451545.0) / 36525;
  // based on http://www.space-plasma.qmul.ac.uk/heliocoords/systems2art/node10.html
  var gmst = 67310.54841 + (876600.0*3600 + 8640184.812866) * t + 0.093104 * t*t - 0.0000062 * t*t*t;
  gmst = (gmst * (Math.PI/180) / 240.0) % (Math.PI*2);
  gmst += (gmst<0) ? Math.PI*2 : 0;
  return gmst;
};

/**
* Get distance to true horizon in meters
* @param   {float} altitude - In meters
* @returns {float}
*/
const getDistanceToHorizon = function(altitude) {
  return Math.sqrt(12.756 * altitude) * 1000;
};

const halfEarthCircumference = parseInt(6371 * Math.PI * 500);

/**
* Calculate position of the sun for a given date
* @param   {Date} date - An instance of Date
* @returns {float[]} [latitude, longitude]
*/
const calculatePositionOfSun = function(date) {
  date = (date instanceof Date) ? date : new Date();

  var rad = 0.017453292519943295;

  // based on NOAA solar calculations
  var mins_past_midnight = (date.getUTCHours() * 60 + date.getUTCMinutes()) / 1440;
  var jc = (jday(date) - 2451545)/36525;
  var mean_long_sun = (280.46646+jc*(36000.76983+jc*0.0003032)) % 360;
  var mean_anom_sun = 357.52911+jc*(35999.05029-0.0001537*jc);
  var sun_eq = Math.sin(rad*mean_anom_sun)*(1.914602-jc*(0.004817+0.000014*jc))+Math.sin(rad*2*mean_anom_sun)*(0.019993-0.000101*jc)+Math.sin(rad*3*mean_anom_sun)*0.000289;
  var sun_true_long = mean_long_sun + sun_eq;
  var sun_app_long = sun_true_long - 0.00569 - 0.00478*Math.sin(rad*125.04-1934.136*jc);
  var mean_obliq_ecliptic = 23+(26+((21.448-jc*(46.815+jc*(0.00059-jc*0.001813))))/60)/60;
  var obliq_corr = mean_obliq_ecliptic + 0.00256*Math.cos(rad*125.04-1934.136*jc);
  var lat = Math.asin(Math.sin(rad*obliq_corr)*Math.sin(rad*sun_app_long)) / rad;
  var eccent = 0.016708634-jc*(0.000042037+0.0000001267*jc);
  var y = Math.tan(rad*(obliq_corr/2))*Math.tan(rad*(obliq_corr/2));
  var rq_of_time = 4*((y*Math.sin(2*rad*mean_long_sun)-2*eccent*Math.sin(rad*mean_anom_sun)+4*eccent*y*Math.sin(rad*mean_anom_sun)*Math.cos(2*rad*mean_long_sun)-0.5*y*y*Math.sin(4*rad*mean_long_sun)-1.25*eccent*eccent*Math.sin(2*rad*mean_anom_sun))/rad);
  var true_solar_time = (mins_past_midnight*1440+rq_of_time) % 1440;
  var lng = -((true_solar_time/4 < 0) ? true_solar_time/4 + 180 : true_solar_time/4 - 180);

  return [lat, lng];
};

/**
* Calculate LatLng of the sun for a given date
* @param   {Date} date - An instance of Date
* @returns {lat: number, lng: number}
*/
const calculateLatLngOfSun = function(date) {
  var pos = calculatePositionOfSun(date);
  return new {latitude: pos[0], longitude: pos[1]};
};

/**
* Parses a string with one or more TLEs
* @param       {string} text - A string containing one or more TLEs
* @returns     {array.<orbits.TLE>} An array of orbit.TLE instances
*/
const parseTLE = function(text) {
  "use strict";
  if(!text || typeof text != "string" || text === "") return [];

  var lines = text.split("\n");

  // trim emepty lines
  for(var i = 0; i < lines.length; i++) if(lines[i] === "") lines.splice(i,1);

  // see if we got somethin reasonable
  if(lines.length < 3) return [];
  if(lines.length % 3 !== 0)
      throw new SyntaxError("The number of lines should be multiple of 3");

  // try and make the array
  var three;
  var array = [];
  while(lines.length) array.push(new TLE(lines.splice(0,3).join("\n")));

  return array;
};

module.exports = {
  mergeOpts,
  gmst,
  getDistanceToHorizon,
  calculateLatLngOfSun,
  parseTLE
}