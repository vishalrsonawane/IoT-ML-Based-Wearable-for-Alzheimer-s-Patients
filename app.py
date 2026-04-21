from flask import Flask, request, jsonify
import time

app = Flask(__name__)

pulse_timestamps = []  # Store timestamps of detected heartbeats
pulse_values = []  # Store recent pulse values

WINDOW_SIZE = 10  # Increased window size
MIN_PEAK_HEIGHT = 10  # Minimum difference to consider a peak
MIN_INTERVAL = 0.3  # Minimum time between beats (equivalent to 200 BPM)

@app.route('/data', methods=['POST'])
def receive_pulse():
    global pulse_timestamps, pulse_values

    data = request.get_json()
    pulse_value = data.get("pulse", 0)
    current_time = time.time()

    # Store recent pulse values
    pulse_values.append({'time': current_time, 'value': pulse_value})

    # Keep only recent readings
    pulse_values = [x for x in pulse_values if current_time - x['time'] < 10]  # 10-second window

    # Peak detection - more robust
    if len(pulse_values) >= 3:
        # Check if middle value is a peak
        prev_val = pulse_values[-2]['value']
        curr_val = pulse_values[-1]['value']
        next_val = pulse_value  # current value is the new incoming one
        
        # Only consider it a peak if:
        # 1. It's higher than neighbors
        # 2. The difference is significant
        # 3. Enough time has passed since last peak
        is_peak = (prev_val < curr_val > next_val and 
                  curr_val - min(prev_val, next_val) > MIN_PEAK_HEIGHT)
        
        if is_peak:
            last_peak_time = pulse_timestamps[-1] if pulse_timestamps else 0
            if current_time - last_peak_time > MIN_INTERVAL:
                pulse_timestamps.append(current_time)
                # Keep only last 10 timestamps
                pulse_timestamps = pulse_timestamps[-10:]

    # Calculate BPM if we have at least 2 timestamps
    if len(pulse_timestamps) >= 2:
        intervals = [pulse_timestamps[i] - pulse_timestamps[i-1] 
                    for i in range(1, len(pulse_timestamps))]
        avg_interval = sum(intervals) / len(intervals)
        bpm = min(200, max(40, 60 / avg_interval))  # Clamp to reasonable values
    else:
        bpm = 0

    response = {"pulse": pulse_value, "bpm": round(bpm)}
    print(f"Received Pulse: {response}")
    return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
