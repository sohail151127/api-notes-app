import React, {useEffect } from 'react'
import { useState } from 'react'
import { Link, useNavigate, useParams} from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BiArrowBack } from 'react-icons/bi';
import "./updateNotes.css";
import { IoCloseSharp } from 'react-icons/io5';
import { FiPlus } from 'react-icons/fi';
import moment from 'moment';
// import Note from "../note/Note.js";
import "../note/note.css";
import _ from "lodash";
import axios from 'axios';
import { Alert, Snackbar } from '@mui/material';


const UpdateNotes = ( ) => {
  const noteId = useParams()
  const navigate = useNavigate()

  const [addItem, setAddItem] = useState([])
  const [title, setTitle] = useState([])
  const [archiveNotes, setArchiveNotes] = useState([])
  const [toggleState, setToggleState] = useState(false)
  const [showDataInButton, setShowDataInButton] = useState("Show Archived")
  const [responsive, setResponsive] = useState("")
  const [message, setMessage] = useState(false)

  const [note, setNotes] = useState(
    {

      name: "",
      amount: ""
    }
  )

  const InputTitle =(e)=>{
    setTitle(e.target.value)
  }

  const InputEvent =(e)=>{
    const {name, value} = e.target;
    setNotes((prevData)=>{
      return{
        ...prevData, 
        [name] : value
      } 
    })
  }
console.log("responsive:",responsive)
console.log("note:",note)

//On First Load of Page, getting old note
  useEffect(() => {

    if (noteId.id !== "new"){
    
      axios.get(`http://foodapis.techenablers.info/api/notes/${noteId.id}`).then((res)=>{
              console.log("notNew-get-response:",res)
              setTitle(res.data.data.note.title)
              setAddItem(res.data.data.note.checklists.filter((x)=>x.status === false))
              setArchiveNotes(res.data.data.note.checklists.filter((x)=>x.status === true))
              setResponsive(res.data.data.note.id)
            })
        .catch(function (error) {
          console.log("notNew-get-response:",error);
        });
      }
    
  }, [ ])
  


  //adding new note
  const addEvent =()=>{

    if(responsive !== ""){
      const {name, amount} = note

        setMessage(false)

        axios.put(`http://foodapis.techenablers.info/api/notes/${responsive}`, {
          "title": title,
          checklists: [
            {
              "name":name,
              "amount":amount
            }
          ]
        })
        .then(function (response) {
          console.log("After1st-post-response:",response);
        if(response.status === 200){
          axios.get(`http://foodapis.techenablers.info/api/notes/${response.data.data.note.id}`)
          .then((res)=>{
            console.log("After1st-get-response",res)
            setAddItem(res.data.data.note.checklists.filter((x)=>x.status === false))
            setArchiveNotes(res.data.data.note.checklists.filter((x)=>x.status === true))
          })
        }
        })
        .catch(function (error) {
          console.log("After1st-post-error:",error);
          setMessage(true)
        });

     

      
    }else if(responsive === ""){
      const {name, amount} = note
      
        setMessage(false)

        axios.post(`http://foodapis.techenablers.info/api/notes`, {
        title: title,
        checklists: [
          {
            name:name,
            amount:amount
          }
        ]
      })
      .then(function (response) {
        console.log("1st-post-response:",response);
        if(response.status === 200){
          setResponsive(response.data.data.note.id)
          axios.get(`http://foodapis.techenablers.info/api/notes/${response.data.data.note.id}`).then((res)=>{
            console.log("1st-get-response:",res)
            setAddItem(res.data.data.note.checklists.filter((x)=>x.status === false))
            setArchiveNotes(res.data.data.note.checklists.filter((x)=>x.status === true))
          })
        }
      })
      .catch(function (error) {
        console.log("1st-post-response:",error);
        setMessage(true)
      });
    }

    setNotes({
      name: "",
      amount: ""
    })

      
  }

  console.log("message:",message)
    //deleting items in the checklists
    const onDelete =(id)=>{
      console.log("delete-id:",id)
      let a = window.confirm("Are you sure?")
      if(a){
                axios.delete(`http://foodapis.techenablers.info/api/checklists/${id}`)
                .then((res)=>{
                  console.log("delete-res:",res)  
                  if(res.status === 200){
                  
                    axios.get(`http://foodapis.techenablers.info/api/notes/${responsive}`)
                    .then((ress)=>{
                      
                      setAddItem(ress.data.data.note.checklists.filter((x)=>x.status === false))
                      setArchiveNotes(ress.data.data.note.checklists.filter((x)=>x.status === true))
                    })
                  }
                })
      }else{
        return;
      }         
    }



    // Doing sum for unArchived items.
    let store= _.map(addItem, (x, i)=>{
      return  Number(x.amount)
    })
    let sum = store.reduce((a,b)=>a+b, 0)



    //updating notes

    const savedContentChange =(e,iddd,index)=>{

      axios.put(`http://foodapis.techenablers.info/api/notes/${responsive}`, {
              "title": title,
              checklists: [
                {
                  "id":iddd,
                  "name":e.target.value,
                  "amount":addItem[index].amount
                }
              ]
            }).then((res)=>{
              console.log("update-content-res:",res)
              setAddItem(res.data.data.note.checklists.filter((x)=>x.status === false))
            })
    }


    const savedAmountChange =(e,iddd,index)=>{

      let name = addItem[index].name
      console.log("name:",name)
      let amount = e.target.value
      console.log("amount:",amount)
      console.log("iddd:",iddd)
      console.log("index:",index)
      axios.put(`http://foodapis.techenablers.info/api/notes/${responsive}`, {
              "title": title,
              checklists: [
                {
                  "id":iddd,
                  "name":name,
                  "amount":amount
                }
              ]
            }).then((res)=>{
              console.log("update-amount-res:",res)
              setAddItem(res.data.data.note.checklists.filter((x)=>x.status === false))
            })
    }

    // on Back Arrow click
    const addKey=()=>{
      if(responsive !== ""){
        setMessage(false)
        axios.get(`http://foodapis.techenablers.info/api/notes/${responsive}`)
        .then((res)=>{
         axios.put(`http://foodapis.techenablers.info/api/notes/${responsive}`, {
            "title": title,
            checklists: res.data.data.note.checklists
          })
          .then((response)=>{
            console.log("last-response:",response)
  
            navigate("/")
          })
          .catch(function (error) {
            console.log("back-arrow-error:",error);
            setMessage(true)
          });
        })
        
      }else{
        navigate("/")
      }
      
      
    }

    //handling unArchived checkboxes
    const handleCheckboxes =(e,iddd)=>{
      console.log("iddd:",iddd)

      axios.post(`http://foodapis.techenablers.info/api/notes/${iddd}/status`, {
        status: 1
      }).then((res)=>{
        console.log("chkbx-res:",res)
        if(res.status === 200){
          axios.get(`http://foodapis.techenablers.info/api/notes/${responsive}`)
          .then((response)=>{

            setAddItem(response.data.data.note.checklists.filter((x)=> x.status === false))

            setArchiveNotes(response.data.data.note.checklists.filter((x)=> x.status === true))

          })
        }
      })

    }


    //handling Archivedcheckboxes
    const handleArchivedCheckboxes =(e,iddd)=>{
      console.log("iddd in archived:",iddd)

      axios.post(`http://foodapis.techenablers.info/api/notes/${iddd}/status`, {
        status: 0
      }).then((res)=>{
        console.log("Archived-chkbx-res:",res)
        if(res.status === 200){
          axios.get(`http://foodapis.techenablers.info/api/notes/${responsive}`)
          .then((response)=>{

            setAddItem(response.data.data.note.checklists.filter((x)=> x.status === false))

            setArchiveNotes(response.data.data.note.checklists.filter((x)=> x.status === true))

          })
        }
      })

    }


     // Archived items sum part...
     let save= _.map(archiveNotes, (x, i)=>{
      return  Number(x.amount)
    })
    let archiveSum = save.reduce((a,b)=>a+b, 0)

    // toggle Button (Show Archived / Hide Archived)
    const toggleButton =()=>{
      setToggleState(!toggleState)
      if(toggleState === true){
        setShowDataInButton("Show Archived")
      }else{
        setShowDataInButton("Hide Archived")
      }
    }

    console.log("addItem:",addItem)
    console.log("archiveNotes:", archiveNotes)
    

    return (
    <>
  <Container fluid className='m-0 p-0'>    
    {/* updateHeader part............. */}
    <Container fluid className='back__arrow1'>
        <Row className='back__arrow2'>  

            <Col xs={1} className='back__arrow3'>
            <Row className='back__arrow3__4 mt-2' onClick={addKey}><BiArrowBack className='back__arrow4' /></Row>
             </Col>  

            <Col xs={11} className='header3'>
                Update Notes
            </Col>
        </Row>
    </Container>

    <Container className='allBelowUodateNotes'>

    {/* EnterTitle part............. */}

    <Container className='container__title'>
        <Row className='row__title'>        
            <Col xs={12} className='col__title'>
                <textarea 
                type="textarea" 
                className='input__title' 
                placeholder='Enter Title'
                value={title} 
                onChange={InputTitle} 
                name="title"                 
                />
             </Col>
        </Row>
    </Container>

    {/* Sum part............. */}

    <Container className='sum'>   
            <div xs={2} className="sum__name__row">
                Sum:
             </div>
             <div xs={9} className="sum__value__row">
                {sum}
             </div>        
    </Container>

{/* toast or snackbar */}
    
          <Snackbar sx={{"width":"40%" }} open={message} autoHideDuration={50} >
            
            <Alert severity="warning"  sx={{"backgroundColor":"rgb(245, 179, 127)" }} >
            No field should be empty!
            </Alert>

          </Snackbar>
          


{/* unArchived Items */}
    {
    _.map(addItem, (val, index)=>{
      return <Container className='enterData1' key={val.id
      }>
      <Row className='enterData2'>
      
          <Col xs={1} className='checkbox__1'>     
          <input checked={val.status} type="checkbox" onChange={(e)=>handleCheckboxes(e,val.id
)} className='checkbox' />
          </Col>

          <Col xs={8} className='input__content'>     
            <textarea 
            type="textarea" 
            className='textArea0' 
            name="name" 
            value={val.name} 
            onChange={(e)=>savedContentChange(e,val.id,index
              )}
            placeholder='Enter Notes' 
            autoComplete='off'
            />
            </Col>

          <Col xs={2} className='input__amount__1'>  
            <input 
            type="number" 
            className='input__amount' 
            value={val.amount} 
            onChange={(e)=>savedAmountChange(e,val.id,index
              )}
            placeholder='Amount' 
            name="amount" 
            autoComplete='off'
            />
          </Col>

          <Col xs={1} className='close__button__1'> 
            <button type="submit" 
            
            className='close__button' onClick={()=>onDelete(val.id
              )}> <IoCloseSharp className='close__button__background' /> </button>
          </Col>
          <Col xs={11} className='date__col__input'>
          <Row className='date__row__input'> 
              {moment(val.created_at).format('ddd ,D MMMM YY, hh:mm a')} 
          </Row>
          </Col>
      </Row>
  </Container>
    })
    }
      
    
    {/* EnterData part............. */}


    <Container className='enterData1' >
        <Row className='enterData2'>
        
            <Col xs={1} className='checkbox__1'>     
            <input type="checkbox" className='checkbox' />
            </Col>

            <Col xs={8} className='input__content'>     
              <textarea 
              type="textarea" 
              className='textArea0' 
              name="name" 
              value={note.name} 
              onChange={InputEvent} 
              placeholder='Enter Notes' 
              autoComplete='off'
              />
              </Col>

            <Col xs={2} className='input__amount__1'>  
              <input 
              type="number" 
              className='input__amount' 
              value={note.amount} 
              onChange={InputEvent} 
              placeholder='Amount' 
              name="amount" 
              autoComplete='off'
              />
            </Col>

            <Col xs={1} className='close__button__1'> 
              <button type="submit" 
              
              className='close__button' > <IoCloseSharp className='close__button__background' /> </button>
            </Col>
            <Col xs={11} className='date__col__input'>
            <Row className='date__row__input'> 
                {moment().format('ddd ,D MMMM YY, hh:mm a')} 
            </Row>
            </Col>
        </Row>
    </Container>


    {/*   show/hide archive button */}
    <Container className='mt-4'>
      <Row>
        <Col className='archived'>
        <button onClick={toggleButton} className='archivedButton'>{showDataInButton}</button>
        </Col>
      </Row>
    </Container>

{/* ....................................... */}
    
    { 
     toggleState?
      <div>
 {/* Archive Sum part............. */}

 <Container className='sum'>   
            <div xs={2} className="sum__name__row">
                Sum:
             </div>
             <div xs={9} className="sum__value__row">
                {archiveSum}
             </div>        
    </Container>


    {/* archived data */}
    {
    _.map(archiveNotes, (val, index)=>{
      return <Container className='enterData1' key={val.id}>
      <Row className='enterData2'>
      
          <Col xs={1} className='checkbox__1'>     
          <input checked={val.status} type="checkbox" onChange={(e)=>handleArchivedCheckboxes(e,val.id)} className='checkbox' />
          </Col>

          <Col xs={8} className='input__content' >     
            <textarea 
            style={{textDecoration: 'line-through'}}
            type="textarea" 
            className='textArea0' 
            name="name" 
            value={val.name} 
            onChange={(e)=>savedContentChange(e,index)}
            placeholder='Enter Notes' 
            autoComplete='off'
            />
            </Col>

          <Col xs={2} className='input__amount__1'>  
            <input 
            style={{textDecoration: 'line-through'}}
            type="number" 
            className='input__amount' 
            value={val.amount} 
            onChange={(e)=>savedContentChange(e,index)}
            placeholder='Amount' 
            name="amount" 
            autoComplete='off'
            />
          </Col>

          <Col xs={1} className='close__button__1'> 
            <button type="submit" 
            
            className='close__button' onClick={()=>onDelete(val.id)}> <IoCloseSharp className='close__button__background' /> </button>
          </Col>
          <Col xs={11} className='date__col__input'>
          <Row className='date__row__input'> 
              {moment(val.created_at).format('ddd ,D MMMM YY, hh:mm a')} 
          </Row>
          </Col>
      </Row>
  </Container>
    })
    }
    </div>: <div></div>
    }

      
    

{/* Footer part............. */}

    <footer className='plus__footer'>
      <button 
      onClick={addEvent} 
      type='submit' 
      className='plus__button'>
      <FiPlus className='plus' />
      </button>
    </footer> 
  </Container>

  </Container>
    </>
  )
}

export default UpdateNotes