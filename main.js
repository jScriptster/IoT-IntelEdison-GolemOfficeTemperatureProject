var config = require('./config.js');
var mraa = require('mraa');
var http = require('http');
var request = require('request');

var tempAnalogPin = new mraa.Aio(config.temperatureGroveKitAnalogConnector);

var lcd = require('jsupm_i2clcd');
var display = new lcd.Jhd1313m1(0, 0x3E, 0x62);

function startup() {
	setLCDColor(25, 255, 25, -1);
	setLCDText({
		line0: 'Hallo!',
		line1: ''
	});
	
	measure(); 
	setInterval(function () {
		measure();    
	}, config.measuringInterval);
}

function measure() {
    var values = [],
        measureFn = function () {
			const B = 3975;
            var a = tempAnalogPin.read(),
                resistance = (1023 - a) * 10000 / a,
                celsius_temperature = 1 / (Math.log(resistance / 10000) / B + 1 / 298.15) - 273.15;
        
            values.push(Math.round(celsius_temperature * 100));
            console.log(values);
            
			if (values.length < 10) { 
                setTimeout(measureFn, 200);
            } else {
				(function () {
					// sometimes first measurement is inaccurate -> ignore it!
					console.log('ignore ', values.splice(0, 1));
					var sum = 0,
						temp,
						i,
						len = values.length;

					for (i = 0; i < len; i++) {
						sum += values[i];    
					}

					temp = Math.round(sum / len) / 100;
					submit(temp);	
				}());	    
            }
        };
    
    measureFn();
}
    
function submit(temp) {
    var queryObj = JSON.parse(JSON.stringify(config.query));
	queryObj.temp = temp;
	
	request({
		method: 'GET',
		uri: config.uri,
		qs: queryObj
	}, function (err, res, body) {
		var status = '';
		if (res) {
			status = res.statusCode;	
		} else if (err) {
			status = 'ERR';
		}
		showOnDisplay(temp, status);
	});
}

function showOnDisplay(temp, status) {
	setLCDColor(255, 30, 90, config.displayLightDuration);
	setLCDText({
		line0: 'Temperatur: ' + temp,
		line1: 'Status Code: ' + status
	});
}

function setLCDColor(r, g, b, duration) {
    display.setColor(r, g, b);
    if (duration > -1) {
        setTimeout(function () {
            setLCDColor(0, 0, 0, -1);    
        }, duration);    
    }
}
    
function setLCDText(txtData) {
    display.clear();
    display.setCursor(0, 0);
    display.write(txtData.line0);
    display.setCursor(1, 0);
    display.write(txtData.line1);
}

startup();