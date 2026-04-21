import React from 'react';
import NavBar from './NavBar';

const DeviceInfo = () => {
  const deviceInfo = {
    deviceName: "Patient Monitoring Unit v1.0",
    microcontroller: {
      name: "ESP8266 (NodeMCU)",
      description: "A low-cost Wi-Fi microchip with a full TCP/IP stack and microcontroller capability.",
      features: ["Integrated Wi-Fi", "Programmable I/O", "Arduino Compatible"],
    },
    sensors: [
      {
        name: "MPU6050",
        type: "Accelerometer & Gyroscope",
        description: "Used for motion detection, specifically to identify patterns indicative of a fall.",
        interface: "I2C (Wire library)",
        dataPoints: ["Acceleration (ax, ay, az)", "Gyroscope (gx, gy, gz)"],
      },
      {
        name: "Pulse Sensor",
        type: "Heart Rate Monitor",
        description: "An analog sensor used to measure heart rate by detecting changes in blood volume.",
        interface: "Analog Pin (A0)",
        dataPoints: ["Raw Pulse Value"],
      },
    ],
    connectivity: {
      wifi: {
        standard: "802.11 b/g/n",
        ssid: "YOUR_WIFI (Configured)",
        security: "WPA2/PSK",
      },
      mqtt: {
        broker: "broker.hivemq.com",
        port: 1883,
        topic: "fall_detection/data",
        protocol: "MQTT over TCP/IP",
      },
    },
    firmware: {
      version: "v1.0.0 (based on provided Arduino sketch)",
      lastUpdated: "N/A (Static Info)",
      dataInterval: "200 ms",
    },
    power: {
      source: "USB / External Power Supply (e.g., LiPo Battery)",
      voltage: "3.3V / 5V (depending on NodeMCU board)",
    }
  };

  return (
    <>
      <NavBar />
      <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center">
              Device Information: <span className="text-blue-600">{deviceInfo.deviceName}</span>
            </h1>

            {/* Microcontroller Section */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">Microcontroller</h2>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-blue-700">{deviceInfo.microcontroller.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{deviceInfo.microcontroller.description}</p>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-2 pl-2">
                  {deviceInfo.microcontroller.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Sensors Section */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">Sensors</h2>
              <div className="space-y-4">
                {deviceInfo.sensors.map((sensor, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-medium text-blue-700">{sensor.name} <span className="text-sm text-gray-500">({sensor.type})</span></h3>
                    <p className="text-sm text-gray-600 mt-1">{sensor.description}</p>
                    <p className="text-sm text-gray-600 mt-1"><span className="font-medium">Interface:</span> {sensor.interface}</p>
                    <p className="text-sm text-gray-600 mt-1 font-medium">Data Points:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 pl-2">
                      {sensor.dataPoints.map((dp, i) => (
                        <li key={i}>{dp}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Connectivity Section */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">Connectivity</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium text-blue-700">Wi-Fi</h3>
                  <p className="text-sm text-gray-600"><span className="font-medium">Standard:</span> {deviceInfo.connectivity.wifi.standard}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Configured SSID:</span> {deviceInfo.connectivity.wifi.ssid}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Security:</span> {deviceInfo.connectivity.wifi.security}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium text-blue-700">MQTT</h3>
                  <p className="text-sm text-gray-600"><span className="font-medium">Broker:</span> {deviceInfo.connectivity.mqtt.broker}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Port:</span> {deviceInfo.connectivity.mqtt.port}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Topic:</span> {deviceInfo.connectivity.mqtt.topic}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Protocol:</span> {deviceInfo.connectivity.mqtt.protocol}</p>
                </div>
              </div>
            </section>
            
            {/* Firmware Section */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">Firmware</h2>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-600"><span className="font-medium">Version:</span> {deviceInfo.firmware.version}</p>
                <p className="text-sm text-gray-600"><span className="font-medium">Data Publishing Interval:</span> {deviceInfo.firmware.dataInterval}</p>
                <p className="text-sm text-gray-600"><span className="font-medium">Last Updated:</span> {deviceInfo.firmware.lastUpdated}</p>
              </div>
            </section>

            {/* Power Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">Power</h2>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-600"><span className="font-medium">Source:</span> {deviceInfo.power.source}</p>
                <p className="text-sm text-gray-600"><span className="font-medium">Operating Voltage:</span> {deviceInfo.power.voltage}</p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </>
  );
};

export default DeviceInfo;
