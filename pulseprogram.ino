#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

// WiFi Credentials
const char* ssid = "Samsung M33";       // Replace with your WiFi SSID
const char* password = "ishan123"; // Replace with your WiFi Password

// Flask Server URL
const char* serverUrl = "http://192.168.248.12:5000/data"; // Change to your Flask server IP

// Pulse Sensor Configuration
#define PULSE_INPUT A0  // Pulse sensor connected to A0

void setup() {
    Serial.begin(115200);

    // Connect to WiFi
    WiFi.begin(ssid, password);
    Serial.print("Connecting to WiFi");
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.print(".");
    }
    Serial.println("\nConnected to WiFi!");

    pinMode(PULSE_INPUT, INPUT);
}

void loop() {
    if (WiFi.status() == WL_CONNECTED) {
        WiFiClient client;
        HTTPClient http;

        int pulseValue = analogRead(PULSE_INPUT); // Read Pulse Sensor Data
        Serial.print("Pulse Value: ");
        Serial.println(pulseValue);

        if (pulseValue > 0) { // Only send data if the reading is valid
            http.begin(client, serverUrl);
            http.addHeader("Content-Type", "application/json");

            // Create JSON payload
            String jsonData = "{\"pulse\": " + String(pulseValue) + "}";

            // Send POST request
            int httpResponseCode = http.POST(jsonData);
            if (httpResponseCode > 0) {
                String response = http.getString();
                Serial.println("Server Response: " + response);
            } else {
                Serial.print("Error in HTTP request: ");
                Serial.println(httpResponseCode);
            }
            http.end();
        }
    }

    delay(2000); // Send data every 2 seconds
}
