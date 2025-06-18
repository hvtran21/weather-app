from flask import Flask, request, jsonify
from retry_requests import retry

import openmeteo_requests
import pandas as pd
import requests_cache

app = Flask(__name__)

# Setup the Open-Meteo API client with cache and retry on error
cache_session = requests_cache.CachedSession('.cache', expire_after = 3600)
retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
openmeteo = openmeteo_requests.Client(session = retry_session)

weather_api_url = "https://api.open-meteo.com/v1/forecast"

# params = {


# }

# responses = openmeteo.weather_api(weather_api_url, params=params)
@app.route('/weather', methods=['GET', 'POST'])
def weather():
    try:
        if request.method == 'POST':

            data = request.get_json()
            latitude = data.get('latitude')
            longitude = data.get('longitude')
            
            params = {
                "latitude": latitude,
                "longitude": longitude,
                "daily": ["temperature_2m_max", "temperature_2m_min"],
                "hourly": ["temperature_2m", "precipitation", "uv_index", "uv_index_clear_sky", "is_day", "precipitation_probability"],
                "current": ["temperature_2m", "precipitation", "apparent_temperature"],
                "timezone": "auto",
                "wind_speed_unit": "mph",
                "temperature_unit": "fahrenheit",
                "precipitation_unit": "inch"
            }

            responses = openmeteo.weather_api(weather_api_url, params=params)
            response = responses[0]
            response_data = {
            "message": "Weather data received successfully",
            "received_latitude": 52,
            "received_longitude": 13,
            "fun_fact": "Looks like a great day to go outside!"
            }

            return jsonify(response_data), 200

    except Exception as e:
        print(f'Error occurred: {e}', flush=True)
        return jsonify({"Error occurred": str(e)}), 500

        

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)