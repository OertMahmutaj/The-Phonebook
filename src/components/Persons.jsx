const Persons = ({ names, deletePerson }) => (
  <>
    {names.map(person => (
      <li key={person.id}>
        {person.name} {person.number}
        {deletePerson && <button onClick={() => deletePerson(person.id)}>delete</button>}
      </li>
    ))}
  </>
)

export default Persons
