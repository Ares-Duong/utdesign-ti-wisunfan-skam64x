const {InfluxDB, Point} = require('@influxdata/influxdb-client')

const url = 'https://us-east-1-1.aws.cloud2.influxdata.com'
const token = "8MkGu8tDM4AHKB69seAD_2mkaOxYlO7CR0xVP-UcQIkI2GnWJwiZ1TkLEq9nrHmjbU4Rj_BmsfarBqenAcjO7w=="
const org = 'rmm180000@utdallas.edu'
const bucket = 'mock_I'

const database = new InfluxDB({
  url: url,
  token: token,
})
const writeApi = database.getWriteApi(org, bucket)
writeApi.useDefaultTags({host: 'host1'})

// retrieved from coap
data = {
  "time": new Date(),
  "measurement": "motionReading",
  "sensor": "11.111.111.111",
  "value": 0
}

console.log(data)

//SendToDatabase
try {
  datapoint = new Point(data["measurement"]).tag("sensor",data["sensor"]).floatField("value",data["value"]).timestamp(new Date())
  writeApi.writePoint(datapoint)
  console.log("Sent datapoint to database.")
} catch (err) {
  console.log("Error while sending to database. Error: " + err)
}

//GetIPs =

//PollData =
