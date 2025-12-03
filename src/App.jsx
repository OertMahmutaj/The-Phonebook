import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import { useState, useEffect } from 'react'
import personServices from './services/persons'

const App = () => {
  const [names, setNames] = useState([])
  const [newName, setNewName] = useState('...enter Name')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
  personServices.getAll().then(initialPersons => {
    console.log('Initial persons from backend:', initialPersons)
    setNames(initialPersons)
  })
}, [])


  console.log(typeof(names))
  console.log(names.map(n => n.name))

  //Filter names shown by typing in the field
  const namesToShow = filter ? 
  names.filter(x =>
  x.name.toLowerCase().includes(filter.toLowerCase())
  )
  : []

  //Handle addition of new people
  const addName = event => {
  event.preventDefault()

  const existingPerson = names.find(n => n.name === newName)
  const nameObject = {
    name: newName,
    number: newNumber
  }

  if (existingPerson) {
    if (
      window.confirm(
        `${newName} is already added to the phonebook. Replace the old number with the new one?`
      )
    ) {
      // Update the existing person's number
      personServices
        .update(existingPerson.id, nameObject)
        .then(returnedPerson => {
          setNames(
            names.map(n => (n.id === existingPerson.id ? returnedPerson : n))
          )
          setNewName('')
          setNewNumber('')
        })
    }
  } else {
    // Add new person
    personServices.create(nameObject).then(returnedPerson => {
      setNames([...names, returnedPerson])
      setNewName('')
      setNewNumber('')
    })
  }
}


//delete Logic
const deletePerson = id => {
  personServices
    .remove(id)
    .then(() => {
      setNames(names.filter(person => person.id !== id))
    })
}



  return (
    <div>
      <h2>Phonebook</h2>

      <Filter 
      filter={filter} 
      setFilter={setFilter} 
      />
      <h2>Add a new</h2>
      <PersonForm 
        newName={newName} 
        setNewName={setNewName} 
        newNumber={newNumber} 
        setNewNumber={setNewNumber} 
        addName={addName} 
      />  

      <h2>Numbers</h2>
      <ul>
        <Persons names={names} deletePerson={deletePerson} />
      </ul>

      <h2>Search Bar</h2>
        {filter && (
      <ul>
        {namesToShow.length > 0 ? (
          <Persons names={namesToShow} deletePerson={deletePerson} />
        ) : (
          <li>No matches found</li>
        )}
      </ul>
    )}


    </div>
  )
}

export default App
