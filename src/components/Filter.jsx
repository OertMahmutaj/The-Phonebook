const Filter = ({filter, setFilter}) => {
    const handlechange = (event) => setFilter(event.target.value)

    return(
     <div>
        filter to show : <input value={filter} onChange={handlechange}/>
     </div>
    )   
}

export default Filter