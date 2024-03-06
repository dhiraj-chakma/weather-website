import * as React from "react";
import styles from "./Search.module.css";

const Search = ({ onSearch }) => {
  const [city, setCity] = React.useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(city);
    setCity("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
      className={styles.searchInput}
        type="text"
        value={city}
        onChange={(event) => setCity(event.target.value)}
      />
      <button className={styles.searchButton} type="submit">Submit</button>
    </form>
  );
};

export default Search;
