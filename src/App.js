import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'
import { FaInstagramSquare } from 'react-icons/fa'

// function for local storage
const getLocalStorage = () =>{
  let list = localStorage.getItem('list')
  if (list){
    return JSON.parse(localStorage.getItem('list'))
  } else {
    return []
  }
}

function App() {
  const [name,setName] = useState('')
  const [list,setList] = useState(getLocalStorage())
  const [isEditing, setIsEditing] = useState(false)
  const [editId,setEditId] = useState(null)
  const [alert,setAlert]= useState ({show:false,msg:'',type:''})

  //handling form functions
  const handleSubmit =(e)=>{
    e.preventDefault()
    if (!name){
      // display alert
      showAlert(true, 'danger', 'Please enter an item')
    }
    else if(name && isEditing){
      setList(list.map((item)=>{
        if (item.id === editId){
          return{...item,title:name}
        }
      return item 
      })) 
      setName('')
      setEditId(null)
      setIsEditing(false)
      showAlert(true, 'success', 'item changed')
    }
    else{
      // show alert
      showAlert(true, 'success', 'item added')
      const newItem ={id: new Date().getTime().toString(), title:name}
      setList ([...list,newItem])
      setName('')
    }
  } 

  // functions for displaying alert alert messages
  const showAlert =(show=false,type="", msg="")=>{
    setAlert({show,type,msg})
  }


  // clearing Items in the list
  const clearList = () =>{
    showAlert(true, 'danger', 'no item in the list')
    setList([])
  }

  // removing individual items from the list
  const removeItem = (id) =>{
    showAlert(true,'danger', 'item removed')
    setList (list.filter((item)=> item.id !==id))
  }
// editing individual items from the list
  const editItem = (id)=>{
  const specificItem = list.find((item)=> item.id === id)
  setIsEditing(true)
  setEditId(id) 
  setName(specificItem.title)
  }

// Saving to local storage

useEffect(()=>{
  localStorage.setItem('list', JSON.stringify(list))
},[list])

// displaying general UI
  return <section className='section-center'>
    <form className='grocery-form' onSubmit={handleSubmit}>
      {alert.show && <Alert {...alert} removeAlert={showAlert}/>}
      <h3>grocery bud</h3>
      <div className="form-control">
        <input type="text" className='grocery' placeholder='e.g Milk' value={name} onChange={(e)=>setName(e.target.value)} />
        <button type='submit' className='submit-btn'>
          {isEditing ? 'edit' : 'submit'}
        </button>
      </div>
    </form>
    {list.length > 0 &&  <div className="grocery-container">
      <List items={list} removeItem={removeItem} editItem={editItem}/>
      <button className="clear-btn"onClick={clearList}>
        clear items
      </button>
    </div>}
   
  </section>
}

export default App
