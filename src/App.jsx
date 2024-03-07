import * as React from "react";
import Search from "./components/Search";
import styles from "./App.module.css";
import Footer from "./components/Footer";
import ForecastDisplay from "./components/ForecastDisplay";


// Main App component
const App = () => {
  // API key for fetching weather data
  const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

  // State for storing weather data, errors, current city, and 5-day forecast data
  const [forecast, setForecast] = React.useState(null);
  const [error, setError] = React.useState("");
  const [city, setCity] = React.useState("Nürnberg");
  const [fiveDayForecast, setFiveDayForecast] = React.useState(null);

  // Effect hook for fetching weather and geographical data based on the city name
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching geographical data for the city to get coordinates
        const geoResponse = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`
        );
        if (!geoResponse.ok) {
          throw new Error(`Network response was not ok: ${geoResponse.status}`);
        }
        const geoData = await geoResponse.json();
        if (geoData.length === 0) {
          throw new Error(`City not found: ${city}`);
        }

        // Extracting latitude and longitude from geographical data
        const [newLat, newLon] = [geoData[0].lat, geoData[0].lon];

        // Fetching current weather data using the coordinates
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${newLat}&lon=${newLon}&appid=${apiKey}`
        );
        if (!weatherResponse.ok) {
          throw new Error(
            `Network response was not ok: ${weatherResponse.status}`
          );
        }
        const weatherData = await weatherResponse.json();
        setForecast(weatherData);

        // Fetching 5-day forecast data using the coordinates
        const forecastHistory = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${newLat}&lon=${newLon}&appid=${apiKey}`
        );
        if (!forecastHistory.ok) {
          throw new Error(
            `Network response was not ok: ${forecastHistory.status}`
          );
        }
        const historyData = await forecastHistory.json();
        setFiveDayForecast(historyData);
      } catch (error) {
        // Handling any errors that occur during the fetch process
        setError(`Failed to fetch data: ${error.message}`);
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [city, apiKey]); // Dependencies for the effect: city and apiKey



  // Rendering error message if there is an error
  if (error) {
    return <div className={styles.error_mes}>{error}</div>;
  }

  // Function to handle search action and update the city state
  const handleSearch = (city) => {
    setCity(city);
  };

  // Main component render method
  return (
    <div className={styles.weather_container}>
      <Search onSearch={handleSearch} />{" "}
      {/* Search component for initiating new city searches */}
      <ForecastDisplay
        forecast={forecast}
        city={city}
        fiveDayForecast={fiveDayForecast}
      />{" "}
      <Footer />
      {/* Displaying the forecast and other weather details */}
    </div>
  );
};

export default App;
