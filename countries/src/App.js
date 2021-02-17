import React, { useState, useEffect } from 'react';
import axios from 'axios'

const States = ({ states }) => states.map(state => <State key={state.name} state={state} />)

const State = ({ state }) => {
  const [showDetail, setShowDetail] = useState(false)

  return (
    <div>
      {state.name}
      <button onClick={() => setShowDetail(!showDetail)}>
        {showDetail && "not"} show
      </button>
      {showDetail && <DetailedState state={state} />}
    </div>)
}

const DetailedState = ({ state }) => {
  return (
    <>
      <h1>{state.name}</h1>
      <p>capital {state.capital}</p>
      <p>population {state.population}</p>
      <h2>languages</h2>
      <Languages languages={state.languages} />
      <img src={state.flag} alt={`${state.name}'s flag`} height='200' width='200' />
    </>
  )
}

const Languages = ({ languages }) => {
  return (
    <ul>
      {languages.map(language => <li key={language.name}>{language.name}</li>)}
    </ul>)
}

const WeatherInfo = ({ capital }) => {
  const [weather, setWeather] = useState({})

  useEffect(() => {
    axios
      .get(`http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_KEY}&query=${capital}`)
      .then((response) => {
        setWeather(response.data)
      })
  }, [capital])

  return (
    <>
      <h2>Weather in {capital}</h2>
      {Object.keys(weather).length !== 0 && (
        <>
          <p><strong>temperature: </strong>{weather.current.temperature} Celsius</p>
          <img src={weather.current.weather_icons[0]} alt={`current weather in ${capital}`} />
          <p><strong>wind: </strong>{weather.current.wind_speed} Kilometers/Hour direction {weather.current.wind_dir}</p>
        </>)}
    </>
  )
}


function App() {
  const [states, setStates] = useState([])
  const [stateFilter, setStateFilter] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setStates(response.data)
      })
  }, [])

  const handleFilterChange = (event) => {
    setStateFilter(event.target.value)
  }

  const statesToShow = states.filter(state => state.name.toUpperCase().includes(stateFilter.toUpperCase()))

  return (
    <>
      <div>
        find countries <input value={stateFilter} onChange={handleFilterChange} />
      </div>
      {statesToShow.length === 1
        ? (
          <>
            <DetailedState state={statesToShow[0]} />
            <WeatherInfo capital={statesToShow[0].capital} />
          </>)
        : (
          statesToShow.length <= 10
            ? <States states={statesToShow} />
            : 'Too many matches, specify another filter'
        )}
    </>
  );
}

export default App;
