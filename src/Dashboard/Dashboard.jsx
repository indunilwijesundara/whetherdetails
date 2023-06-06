import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.scss";
import {
  FaThermometerHalf,
  FaSun,
  FaWater,
  FaWind,
  FaClock,
  FaCloud,
  FaCloudRain,
} from "react-icons/fa";

const Dashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [forecastData, setForecastData] = useState([]);
  const apiKey = "183b3d4d8682b5e0f80ad4679e89e586";
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast`;
  const [weeklyForecastData, setWeeklyForecastData] = useState([]);
  const [showWeeklyForecast, setShowWeeklyForecast] = useState(false);

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(currentWeatherUrl, {
        params: {
          q: "Colombo",
          appid: apiKey,
          units: "metric",
        },
      });
      setWeatherData(response.data);

      const forecastResponse = await axios.get(forecastUrl, {
        params: {
          q: "Colombo",
          appid: apiKey,
          units: "metric",
        },
      });

      // Get the current date
      const currentDate = new Date();

      // Filter the forecast data for the next three consecutive days
      const forecastData = forecastResponse.data.list.filter((forecast) => {
        const forecastDate = new Date(forecast.dt * 1000);
        return (
          forecastDate.getDate() !== currentDate.getDate() && // Exclude today's forecast
          forecastDate.getDate() <= currentDate.getDate() + 3
        );
      });

      // Group the forecasts by date
      const forecastByDate = forecastData.reduce((acc, forecast) => {
        const forecastDate = new Date(forecast.dt * 1000);
        const dateKey = forecastDate.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });

        if (!acc[dateKey]) {
          acc[dateKey] = forecast;
        }

        return acc;
      }, {});

      // Get the forecast data for the next three days
      const nextThreeDaysForecast = Object.values(forecastByDate);

      setForecastData(nextThreeDaysForecast);

      // Get the forecast data for the whole week
      const weeklyForecastData = forecastResponse.data.list;

      // Group the weekly forecasts by date
      const weeklyForecastByDate = weeklyForecastData.reduce(
        (acc, forecast) => {
          const forecastDate = new Date(forecast.dt * 1000);
          const dateKey = forecastDate.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });

          if (!acc[dateKey]) {
            acc[dateKey] = forecast;
          }

          return acc;
        },
        {}
      );

      // Get the forecast data for the whole week
      const weeklyForecast = Object.values(weeklyForecastByDate);

      setWeeklyForecastData(weeklyForecast);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const fetchWeatherDataByCoordinates = async () => {
    try {
      const response = await axios.get(currentWeatherUrl, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: apiKey,
          units: "metric",
        },
      });
      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const fetchWeatherForecast = async () => {
    try {
      const response = await axios.get(forecastUrl, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: apiKey,
          units: "metric",
        },
      });

      const forecastData = response.data.list;

      // Group the forecasts by date
      const forecastByDate = forecastData.reduce((acc, forecast) => {
        const forecastDate = new Date(forecast.dt * 1000);
        const dateKey = forecastDate.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });

        if (!acc[dateKey]) {
          acc[dateKey] = forecast;
        }

        return acc;
      }, {});

      // Get the forecast data for the whole week
      const weeklyForecast = Object.values(forecastByDate);

      setWeeklyForecastData(weeklyForecast);
    } catch (error) {
      console.error("Error fetching weekly weather forecast data:", error);
    }
  };

  useEffect(() => {
    if (latitude && longitude) {
      fetchWeatherDataByCoordinates();
      fetchWeatherForecast();
    } else {
      fetchWeatherData();
    }
  }, [latitude, longitude]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (latitude && longitude) {
      fetchWeatherDataByCoordinates();
      fetchWeatherForecast();
    }
  };

  return (
    <div className="dashboard-container">
      <div className="search-container">
        <h1>Weather Details</h1>

        <form onSubmit={handleSearch}>
          <h3>Search by Latitude and Longitude</h3>
          <div className="form-group">
            <label htmlFor="latitude">Latitude</label>
            <input
              type="text"
              id="latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="longitude">Longitude</label>
            <input
              type="text"
              id="longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-search">
            Search
          </button>
        </form>
      </div>

      {weatherData ? (
        <div className="weather-info">
          <hr />
          <h2>
            Today's Weather in <i>{weatherData.name}</i>
          </h2>

          <div>
            <p>
              <FaThermometerHalf /> Temperature {weatherData.main.temp}°C
            </p>
            <p>
              {weatherData.weather[0].main === "Clouds" ? (
                <FaCloud />
              ) : weatherData.weather[0].main === "Rain" ? (
                <FaCloudRain />
              ) : (
                <FaSun />
              )}{" "}
              Weather {weatherData.weather[0].main}
            </p>
            <p>
              <FaWater /> Humidity {weatherData.main.humidity}%
            </p>
            <p>
              <FaWind /> Wind Speed {weatherData.wind.speed} m/s
            </p>
            <p>
              <FaClock /> Sunrise{" "}
              {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}
            </p>
            <p>
              <FaClock /> Sunset{" "}
              {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}
            </p>
          </div>
          <hr />
          <div>
            {forecastData.length > 0 && (
              <div className="forecast-container">
                <h2>Next Three Day Forecast</h2>
                <div className="items">
                  {forecastData.map((forecast, index) => (
                    <div className="forecast-item" key={index}>
                      <p className="forecast-date">
                        {new Date(forecast.dt * 1000).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                      <p className="forecast-temp">
                        Temperature: {forecast.main.temp}°C
                      </p>
                      <p className="forecast-description">
                        {forecast.weather[0].main}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  className="btn-view-more"
                  onClick={() => setShowWeeklyForecast(!showWeeklyForecast)}
                >
                  {showWeeklyForecast
                    ? "Hide Weekly Forecast"
                    : "View Weekly Forecast"}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="loading-message">Loading weather data...</div>
      )}
      {showWeeklyForecast && (
        <div className="weekly-forecast-container">
          <h2>Weekly Forecast</h2>
          <div className="weekly-forecast-items">
            {weeklyForecastData.map((forecast, index) => (
              <div className="weekly-forecast-item" key={index}>
                <p className="weekly-forecast-date">
                  {new Date(forecast.dt * 1000).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="weekly-forecast-temp">
                  Temperature: {forecast.main.temp}°C
                </p>
                <p className="weekly-forecast-description">
                  {forecast.weather[0].main}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
