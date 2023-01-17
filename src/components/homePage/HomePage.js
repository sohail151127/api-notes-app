import React, { useEffect, useState } from 'react'
import "./homePage.css"
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { AiOutlineSearch } from 'react-icons/ai';
import { BiDotsVerticalRounded } from 'react-icons/bi';
// import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiPlus } from 'react-icons/fi';
// import AddLines from '../homePage/addLines/AddLines';
import ListItem from './listItem/ListItem';
import NavDropdown from 'react-bootstrap/NavDropdown';
import "bootstrap/dist/css/bootstrap.min.css";
import _ from 'lodash';
import axios from 'axios';


const HomePage = ( ) => {
  const [query, setQuery] = useState("")
  const [allNotes, setAllNotes] = useState([])

  const refresh =(deleteNote)=>{
    setAllNotes(deleteNote)
  }


useEffect(() => {
 allNotesfn()
}, [])

const allNotesfn=async()=>{
await axios.get("https://www.foodapis.techenablers.info/api/notes")
.then((res)=>{
console.log("home page all notes:",res)
setAllNotes(res.data.data.notes)
})
}
console.log("allNotes",allNotes.map((x)=>x.checklists
))

  return (
    <>
    <Container fluid className='m-0 p-0'>
{/* home page header part */}
    <Container fluid className='headerContainer'>
        <Row className='header__1'>        
            <Col xs={4} className='header3'>
               Notes
             </Col>

             <Col xs={8} className='dots__icon'>
             
                <NavDropdown 
                  title={<button className='header__button__dot'><BiDotsVerticalRounded className='dot' /></button>} 
                  id="basic-nav-dropdown" 
                  className="navDrop">

                  <NavDropdown.Item as="button"
                    
                    className='navItem'>
                      <a
                          className='export'
                          href={`data:text/json;charset=utf-8,${encodeURIComponent(
                            JSON.stringify(allNotes)
                          )}`}
                          download="filename.json"
                        >
                          {`Export`}
                      </a>
                      
                  </NavDropdown.Item>

                </NavDropdown>
              
            </Col>
        </Row>
    </Container>

    

<Container className='allBelowHomeNote'>
    {/* home page search bar part */}

    <Container className='searchFixed'>
    <Row className='searchFixedRow'>        
        <Col xs={11} className="border__searchBar">
            
            <input onChange={(e)=>setQuery(e.target.value)} value={query} type="text" placeholder='Search' className='input'/>

            <button type='submit' className='button'><AiOutlineSearch className='searchIcon__background'/></button>
        </Col>
    </Row>
    </Container> 

    {/* home page below search bar saved data  */}  
    <Container className='containerItems'>
      <Row className="main__row">     

{
    _.map( _.filter(allNotes, (a,i)=>a.title?.toLowerCase().includes(query?.toLocaleLowerCase()) ||
    a.checklists.some(d=>d.name?.toLowerCase().includes(query?.toLocaleLowerCase())) ||
    a.checklists.some(d=>String(d.amount)?.includes(String(query)))
    ) , (x,i)=>{
      return <ListItem 
              x={x}
              key={i}
              id ={i}
              query={query}
              refresh={refresh}
              
      />
    })
   }
      </Row>
  </Container>

{/* home page footer plus sighn for adding new data */}

  <footer className='plus__footer'>
      <Link to="UpdateNotes/new"
      
      type='submit' 
      className='plus__button'
      >
      <FiPlus className='plus' />
      </Link>
    </footer>

    
{/* ...............................   */}
</Container>
        
    </Container>
    </>
  )
}

export default HomePage