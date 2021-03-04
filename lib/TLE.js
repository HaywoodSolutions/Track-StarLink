/**
* takes a Date instance and return julian day
* @param   {Date} date - Date instance
* @returns {float}
*/

const jday = function(date) {
  return (date.getTime() / 86400000.0) + 2440587.5;
};

module.exports = class TLE {
  /**
  * Initializes a TLE object containing parsed TLE
  * @class
  * @param {string} text - A TLE string of 3 lines
  */
  
  constructor(text) {
    this.text = text;
    this.parse(this.text);
  }

    
  /**
  * Parses TLE string and sets the proporties
  * @param {string} text - A TLE string of 3 lines
  */
  parse(text) {
    "use strict";
    var lines = text.split("\n");

    if(lines.length != 3) throw new SyntaxError("Invalid TLE syntax");

    // parse first line
    this.name = lines[0].substring(0,24).trim();

    // parse second line
    if(lines[1][0] != "1") throw new SyntaxError("Invalid TLE syntax");

    // TODO: verify line using the checksum in field 14

    /**
     * Satellite Number
     * @type {int}
     * @readonly
     */
    this.satelite_number = parseInt(lines[1].substring(2,7));

    /**
     * Classification (U=Unclassified)
     * @type {string}
     * @readonly
     */
    this.classification = lines[1].substring(7,8);

    /**
     * International Designator (Last two digits of launch year, eg. '98')
     * @type {string}
     * @readonly
     */
    this.intd_year = lines[1].substring(9,11);

    /**
     * International Designator (Launch number of the year, eg. '067')
     * @type {string}
     * @readonly
     */
    this.intd_ln = lines[1].substring(11,14);

    /**
     * International Designator (Piece of the launch, eg. 'A')
     * @type {string}
     * @readonly
     */
    this.intd_place = lines[1].substring(14,17).trim();

    /**
     * International Designator (eg. 98067A)
     * @type {string}
     * @readonly
     */
    this.intd = lines[1].substring(9,17).trim();

    /**
     * Epoch Year (Full year)
     * @type {int}
     * @readonly
     */
    this.epoch_year = parseInt(lines[1].substring(18,20));
    this.epoch_year += (this.epoch_year < 57) ? 2000 : 1000;

    /**
     * Epoch (Day of the year and fractional portion of the day)
     * @type {float}
     * @readonly
     */
    this.epoch_day = parseFloat(lines[1].substring(20,32));

    /**
     * First Time Derivative of the Mean Motion divided by two
     * @type {float}
     * @readonly
     */
    this.ftd = parseFloat(lines[1].substring(33,43));

    /**
     * Second Time Derivative of Mean Motion divided by six
     * @type {float}
     * @readonly
     */
    this.std = 0;
    var tmp = lines[1].substring(44,52).split(/[+-]/);
    if(tmp.length == 3) this.std = -1 * parseFloat("."+tmp[1].trim()) * Math.pow(10,-parseInt(tmp[2]));
    else this.std = parseFloat("."+tmp[0].trim()) * Math.pow(10,-parseInt(tmp[1]));

    /**
     * BSTAR drag term
     * @type {float}
     * @readonly
     */
    this.bstar = 0;
    tmp = lines[1].substring(53,61).split(/[+-]/);
    if(tmp.length == 3) this.bstar = -1 * parseFloat("."+tmp[1].trim()) * Math.pow(10,-parseInt(tmp[2]));
    else this.bstar = parseFloat("."+tmp[0].trim()) * Math.pow(10,-parseInt(tmp[1]));

    /**
     * The number 0 (Originally this should have been "Ephemeris type")
     * @type {int}
     * @readonly
     */
    this.ehemeris_type = parseInt(lines[1].substring(62,63));

    /**
     * Element set number. incremented when a new TLE is generated for this object.
     * @type {int}
     * @readonly
     */
    this.element_number = parseInt(lines[1].substring(64,68));

    // parse third line
    if(lines[2][0] != "2") throw new SyntaxError("Invalid TLE syntax");

    // TODO: verify line using the checksum in field 14

    /**
     * Inclination [Degrees]
     * @type {float}
     * @readonly
     */
    this.inclination = parseFloat(lines[2].substring(8,16));

    /**
     * Right Ascension of the Ascending Node [Degrees]
     * @type {float}
     * @readonly
     */
    this.right_ascension = parseFloat(lines[2].substring(17,25));

    /**
     * Eccentricity
     * @type {float}
     * @readonly
     */
    this.eccentricity = parseFloat("."+lines[2].substring(26,33).trim());

    /**
     * Argument of Perigee [Degrees]
     * @type {float}
     * @readonly
     */
    this.argument_of_perigee = parseFloat(lines[2].substring(34,42));

    /**
     * Mean Anomaly [Degrees]
     * @type {float}
     * @readonly
     */
    this.mean_anomaly = parseFloat(lines[2].substring(43,51));

    /**
     * Mean Motion [Revs per day]
     * @type {float}
     * @readonly
     */
    this.mean_motion = parseFloat(lines[2].substring(52,63));

    /**
     * Revolution number at epoch [Revs]
     * @type {int}
     * @readonly
     */
    this.epoch_rev_number = parseInt(lines[2].substring(63,68));
  };

  /**
  * Takes a date instance and returns the different between it and TLE's epoch
  * @param       {Date} date - A instance of Date
  * @returns     {int} delta time in millis
  */
  dtime(date) {
    var a = jday(date);
    var b = jday(new Date(Date.UTC(this.epoch_year, 0, 0, 0, 0, 0) + this.epoch_day * 86400000));
    return (a - b) * 1440.0; // in minutes
  };

  /**
  * Returns the TLE string
  * @returns {string} TLE string in 3 lines
  */
  toString() {
    return this.text;
  };
};