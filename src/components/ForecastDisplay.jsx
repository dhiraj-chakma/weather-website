// Importing styles from the CSS module and necessary components from Recharts for charting
import styles from "./ForecastDisplay.module.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";

// Function to convert Unix timestamp to a readable day of the week
function getDayOfWeek(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

// Function to convert Unix timestamp to a readable time format
const convertUnixToReadable = (time) => {
  const date = new Date(time * 1000);
  return date.toLocaleString("en-Us", { hour: "2-digit", minute: "2-digit" });
};

// Main component to display weather forecast
const ForecastDisplay = ({ forecast, city, fiveDayForecast }) => {
  // Display loading message if forecast data is not yet available
  if (!forecast) return <div>Loading weather data...</div>;

  // Preparing data for the chart by mapping over fiveDayForecast.list
  const chartData = fiveDayForecast
    ? fiveDayForecast.list.map((item) => ({
        date: item.dt_txt,
        temp: item.main.temp - 273.15, // Convert to Celsius
        feels_like: item.main.feels_like - 273.15, // Also in Celsius
      }))
    : [];

  // Main component rendering
  return (
    <div className={styles.weatherCard}>
      {/* Display city name */}
      <div className={styles.weatherCard_main}>
        <h2>{city}</h2>
        <div className={styles.weather_summary_container}>
          {/* Current weather temperature and condition */}
          <div className={styles.weather_temp}>
            <p>
              <span className={styles.bigFont}>
                {(forecast.main.temp - 273.15).toFixed(2)}°
              </span>{" "}
              {forecast.weather[0].main}
            </p>
          </div>
          {/* Detailed weather information like high/low temperature, sunrise, and sunset */}
          <div className={styles.detailedWeatherInfo}>
            {/* Displaying high and low temperatures for the day */}
            <div className={styles.high_low_temp}>
              <p>{getDayOfWeek(forecast.dt)}</p>
              <div>
                <span>
                  <FontAwesomeIcon icon={faArrowDown} />{" "}
                </span>
                <span>{(forecast.main.temp_min - 273.15).toFixed(2)}°C</span>
              </div>
              <div>
                <span>
                  <FontAwesomeIcon icon={faArrowUp} />{" "}
                </span>
                <span>{(forecast.main.temp_max - 273.15).toFixed(2)}°C</span>
              </div>
            </div>

            {/* Sunrise and sunset times */}
            <div className={styles.sunset_sunrise}>
              <p>
                <FontAwesomeIcon icon={faSun} />
                {convertUnixToReadable(forecast.sys.sunrise)}
              </p>
              <p>
                <FontAwesomeIcon icon={faMoon} />{" "}
                {convertUnixToReadable(forecast.sys.sunset)}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Additional weather details like wind speed, humidity, etc. */}
      <div className={styles.weather_detail_history}>
        <div className={styles.weather_card_details}>
          <h2>Weather details</h2>
          <div className={styles.grid_container}>
            {/* Displaying feels like temperature, wind speed, humidity, visibility, pressure, and timezone */}
            <div className={styles.weather_card_detail}>
              <p>
                Feels like <br />
                {(forecast.main.feels_like - 273.15).toFixed(2)}°
              </p>
            </div>
            <div className={styles.weather_card_detail}>
              <p>
                ENE wind <br />
                {forecast.wind.speed} mi/h
              </p>
            </div>
            <div className={styles.weather_card_detail}>
              <p>
                Humidity
                <br />
                {forecast.main.humidity}%
              </p>
            </div>
            <div className={styles.weather_card_detail}>
              <p>
                Visibility
                <br />
                {`${(forecast.visibility / 1609.34).toFixed(2)} miles`}
              </p>
            </div>
            <div className={styles.weather_card_detail}>
              <p>
                Pressure
                <br />
                {forecast.main.pressure} hPa
              </p>
            </div>
            <div className={styles.weather_card_detail}>
              <p>
                Timezone
                <br />
                {forecast.timezone}
              </p>
            </div>
          </div>
        </div>
        {/* Chart showing 5-day weather forecast */}
        <div className={styles.weatherChart}>
          <h2>5 day weather forecast</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fill: "black", angle: -45, textAnchor: "end" }}
                height={70} // Adjust the height to accommodate rotated labels
                tickFormatter={(dateStr) => {
                  // Format the date to a more compact form if necessary
                  const date = new Date(dateStr);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis
                label={{
                  value: "Temperature (°C)",
                  angle: -90,
                  position: "insideLeft",
                }}
                tick={{ fill: "black" }}
              />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="temp" stroke="#14213d" />
              <Line type="monotone" dataKey="feels_like" stroke="#e76f51" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ForecastDisplay;
