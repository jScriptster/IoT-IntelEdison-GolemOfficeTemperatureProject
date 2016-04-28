module.exports = {
	/* 
	 * documentation get-params and token-generation: 
	 * http://www.golem.de/projekte/ot/doku.php 
	*/
	uri: 'http://www.golem.de/projekte/ot/temp.php',
	query: {
		dbg:        1,
        token:      '[YOUR TOKEN FROM GOLEM]',
        city:       'Berlin',
        zip:        '10115',
        country:    'DE',
        lat:        '52.528126',
        long:       '13.379538',
        type:       'ard'		
	},
	temperatureGroveKitAnalogConnector: 2,
	measuringInterval: 1000 * 60 * 30,
	displayLightDuration: 1000 * 30
};