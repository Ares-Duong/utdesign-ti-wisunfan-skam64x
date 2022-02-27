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

// data will be filled out with PollData. m = motion, n = noise
data = {
  m_name: "motionReading",
  m_timestamp: new Date(),
  m_value: false,
  n_name: "noiseReading",
  n_timestamp: new Date(),
  n_value: 0
}

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

// loop on a timer: every dataPollInt
setInterval( async () => {
  GetIPs()
  // skip last ip address (border router)
  for(let i = 0; i < ipList.length-1; i++) {
    PollData(ipList[i])

    let datapoint = PointMotion(data, ipList[i])
    PlotPoint(datapoint)

    datapoint = PointNoise(data, ipList[i])
    PlotPoint(datapoint)
  }
}, dataPollInt);

// Populate ipList with connected ips
// Returns null
function GetIPs() {
  ipList = topology.connectedDevices
}

// CoAP request to a single ip address, asking for motion and noise readings
// Returns null
function PollData(targetIP) {
  configGet.host = targetIP;
  const response = coap.request(configGet);

  // When coap.request() returns a response, extract the data from buffer
  response.on("response", (res) => {
    data[m_name] = getResponse.payload.readUInt8(0)
    data[m_timestamp] = getResponse.payload.readUInt8(1)
    data[m_value] = !!getResponse.payload.readUInt8(2)

    data[n_name] = getResponse.payload.readUInt8(3)
    data[n_timestamp] = getResponse.payload.readUInt8(4)
    data[n_value] = getResponse.payload.readUInt8(5)
  });

  getRequest.end();
}

// Send a datapoint to the database
// Returns null
function PlotPoint(datapoint) {
  try {
    writeApi.writePoint(datapoint)
    console.log("Sent datapoint to database.")
  } catch (err) {
    console.log("Error while sending to database. Error: " + err)
  }
}

// Returns a point for the motion dataset
function PointMotion(dat, ip) {
  return new Point(dat[m_name]).tag("sensor",ip).floatField("value",dat[m_value]).timestamp(dat[m_timestamp])
}

// Returns a point for the noise dataset
function PointNoise(dat, ip) {
  return new Point(dat[n_name]).tag("sensor",ip).floatField("value",dat[n_value]).timestamp(dat[n_timestamp])
}
