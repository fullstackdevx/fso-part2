import React, { useState, useEffect } from 'react';
import axios from 'axios'

const States = ({ states }) => states.map(state => <State key={state.name} state={state} />)

const State = ({ state }) => <p>{state.name}</p>

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
      {statesToShow.length === 1 ? <DetailedState state={statesToShow[0]} /> : (statesToShow.length <= 10 ? <States states={statesToShow} /> : 'Too many matches, specify another filter')}
    </>
  );
}

export default App;
