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
const dataPollInt = 5000

// data will be filled out with PollData
data = {
  "time": new Date(),
  "measurement": "motionReading",
  "sensor": "11.111.111.111",
  "value": 0
}

console.log(data)

// ipList will be populated through GetIPs using the topology
const topologyRoute = "http://localhost:80/topology"
let ipList = []

// Contains configurations used in coap requests
const configGet = {
  observe: false,
  host: null,
  pathname: '/led',
  method: 'get',
  confirmable: 'true',
  retrySend: 'true',
  options: {},
};

// while on, execute every dataPollInt
setInterval( async () => {
  GetIPs()
  // for each ip in iplist except last (border router)
  for(let i = 0; i < ipList.length-1; i++) {
    PollData(ipList[i])
    SendToDatabase(data)
  }
}, dataPollInt);

// Populate ipList with connected ips
// Returns null
function GetIPs() {
  ipList = topology.connectedDevices
}

// CoAP request to a single ip address
// Returns null
function PollData(targetIP) {
  configGet.host = targetIP;
  const response = coap.request(configGet);

  // When coap.request() returns a response, extract the data
  response.on("response", (res) => {
    data["measurement"] = getResponse.payload.readUInt8(0) // motionReading or noiseReading

    data["sensor"] = getResponse.payload.readUInt8(1); // ip address

    if(data["measurement"] == "motionReading") {
      data["value"] = !!getResponse.payload.readUInt8(2) // expected boolean
    } else if(data["measurement"] == "noiseReading") {
      data["value"] = getResponse.payload.readUInt8(2) // expected float
    }
  });

  getRequest.end();
}

// Send a datapoint to the database
// Returns null
function SendToDatabase(dat) {
  try {
    datapoint = new Point(dat["measurement"]).tag("sensor",dat["sensor"]).floatField("value",dat["value"]).timestamp(new Date())
    writeApi.writePoint(datapoint)
    console.log("Sent datapoint to database.")
  } catch (err) {
    console.log("Error while sending to database. Error: " + err)
  }
}
