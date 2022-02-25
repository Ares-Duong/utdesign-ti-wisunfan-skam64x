const {InfluxDB, Point} = require('@influxdata/influxdb-client')

const url = 'https://us-east-1-1.aws.cloud2.influxdata.com'
const token = "8MkGu8tDM4AHKB69seAD_2mkaOxYlO7CR0xVP-UcQIkI2GnWJwiZ1TkLEq9nrHmjbU4Rj_BmsfarBqenAcjO7w=="
const org = 'rmm180000@utdallas.edu'
const bucket = 'mock_I'

// links to the influx database indicated by the url using the token
const database = new InfluxDB({
  url: url,
  token: token,
})

// writeApi allows write and query access to the bucket
const writeApi = database.getWriteApi(org, bucket)
writeApi.useDefaultTags({host: 'host1'})

// Interval between data collection
const dataPollInt = 1000

// data will be filled out with PollData
data = {
  "time": new Date(),
  "measurement": "motionReading",
  "sensor": "11.111.111.111",
  "value": 0
}

// ipList will be populated through GetIPs
//let ipList = []

console.log(data)

// while on, every dataPollInt
//   GetIPs
//   for each ip in iplist except last (border router)
//     PollData
       SendToDatabase()

function GetIPs() {
  // ipList = topology.connectedDevices
}

// CoAP request
function PollData() {
  // The following code is copied from the LED code
/*
  export function getCoapLedStatus(targetIP) {
    getOptions.host = targetIP;
    const getRequest = coap.request(getOptions);

    getRequest.on('response', (getResponse) => {
      ledStates.rled = !!getResponse.payload.readUInt8(0);
      ledStates.gled = !!getResponse.payload.readUInt8(1);
    });

    getRequest.end();
    return ledStates;
  }
*/
}

//send a datapoint to the database
function SendToDatabase() {
  try {
    datapoint = new Point(data["measurement"]).tag("sensor",data["sensor"]).floatField("value",data["value"]).timestamp(new Date())
    writeApi.writePoint(datapoint)
    console.log("Sent datapoint to database.")
  } catch (err) {
    console.log("Error while sending to database. Error: " + err)
  }
}
