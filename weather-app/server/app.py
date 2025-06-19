from flask import Flask, request, jsonify
from retry_requests import retry
from datetime import datetime, timezone

import json
import openmeteo_requests
import pandas as pd
import requests_cache

app = Flask(__name__)

# Setup the Open-Meteo API client with cache and retry on error
cache_session = requests_cache.CachedSession('.cache', expire_after = 3600)
retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
openmeteo = openmeteo_requests.Client(session = retry_session)

weather_api_url = "https://api.open-meteo.com/v1/forecast"

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
                "daily": ["temperature_2m_max", "temperature_2m_min", "uv_index_max", "sunset", "sunrise", "rain_sum", "weather_code", "precipitation_probability_max"],
                "hourly": ["temperature_2m", "precipitation", "uv_index", "uv_index_clear_sky", "is_day", "precipitation_probability", "visibility", "wind_speed_10m", "weather_code"],
                "current": ["temperature_2m", "precipitation", "apparent_temperature", "relative_humidity_2m", "weather_code", "wind_speed_10m"],
                "timezone": "auto",
                "wind_speed_unit": "mph",
                "temperature_unit": "fahrenheit",
                "precipitation_unit": "inch"
            }

            responses = openmeteo.weather_api(weather_api_url, params=params)
            response = responses[0]
            data = {}
            print(f"Elevation {response.Elevation()} m asl")

            print(f"Timezone {response.Timezone()}{response.TimezoneAbbreviation()}")
            print(f"Timezone difference to GMT+0 {response.UtcOffsetSeconds()} s")

            # Current values. The order of variables needs to be the same as requested.
            current = response.Current()

            data['today'] = {
                'today_temperature_2m': current.Variables(0).Value(),
                'today_precipitation': current.Variables(1).Value(),
                'today_apparent_temperature': current.Variables(2).Value(),
                'today_relative_humidity_2m': current.Variables(3).Value(),
                'today_weather_code': current.Variables(4).Value(),
                'today_wind_speed_10m': current.Variables(5).Value(),
            }

            # Process hourly data. The order of variables needs to be the same as requested.
            hourly = response.Hourly()
            hourly_temperature_2m = hourly.Variables(0).ValuesAsNumpy()
            hourly_precipitation = hourly.Variables(1).ValuesAsNumpy()
            hourly_uv_index = hourly.Variables(2).ValuesAsNumpy()
            hourly_uv_index_clear_sky = hourly.Variables(3).ValuesAsNumpy()
            hourly_is_day = hourly.Variables(4).ValuesAsNumpy()
            hourly_precipitation_probability = hourly.Variables(5).ValuesAsNumpy()
            hourly_visibility = hourly.Variables(6).ValuesAsNumpy()
            hourly_wind_speed_10m = hourly.Variables(7).ValuesAsNumpy()

            hourly_data = {"date": pd.date_range(
                start = pd.to_datetime(hourly.Time(), unit = "s", utc = True),
                end = pd.to_datetime(hourly.TimeEnd(), unit = "s", utc = True),
                freq = pd.Timedelta(seconds = hourly.Interval()),
                inclusive = "left"
            )}

            hourly_data["temperature_2m"] = hourly_temperature_2m
            hourly_data["precipitation"] = hourly_precipitation
            hourly_data["uv_index"] = hourly_uv_index
            hourly_data["uv_index_clear_sky"] = hourly_uv_index_clear_sky
            hourly_data["is_day"] = hourly_is_day

            hourly_data["precipitation_probability"] = hourly_precipitation_probability
            hourly_data["visibility"] = hourly_visibility
            hourly_data["wind_speed_10m"] = hourly_wind_speed_10m

            hourly_dataframe = pd.DataFrame(data = hourly_data)       
            now_utc = datetime.now(timezone.utc) 
            hourly_dataframe = hourly_dataframe[hourly_dataframe['date'] >= pd.Timestamp(now_utc)][:25]
            data['hourly'] = json.loads(hourly_dataframe.to_json(orient='records'))

            # Process daily data. The order of variables needs to be the same as requested.
            daily = response.Daily()
            daily_temperature_2m_max = daily.Variables(0).ValuesAsNumpy()
            daily_temperature_2m_min = daily.Variables(1).ValuesAsNumpy()
            daily_uv_index_max = daily.Variables(2).ValuesAsNumpy()
            daily_sunset = daily.Variables(3).ValuesInt64AsNumpy()
            daily_sunrise = daily.Variables(4).ValuesInt64AsNumpy()
            daily_rain_sum = daily.Variables(5).ValuesAsNumpy()

            daily_data = {"date": pd.date_range(
                start = pd.to_datetime(daily.Time(), unit = "s", utc = True),
                end = pd.to_datetime(daily.TimeEnd(), unit = "s", utc = True),
                freq = pd.Timedelta(seconds = daily.Interval()),
                inclusive = "left"
            )}

            daily_data["temperature_2m_max"] = daily_temperature_2m_max
            daily_data["temperature_2m_min"] = daily_temperature_2m_min
            daily_data["uv_index_max"] = daily_uv_index_max
            daily_data["sunset"] = daily_sunset
            daily_data["sunrise"] = daily_sunrise
            daily_data["rain_sum"] = daily_rain_sum

            daily_dataframe = pd.DataFrame(data = daily_data)
            data['daily'] = json.loads(daily_dataframe.to_json(orient='records'))

            return jsonify(data), 200

    except Exception as e:
        print(f'Error occurred: {e}', flush=True)
        return jsonify({"Error occurred": str(e)}), 500

        

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)