import React, {useEffect } from 'react'
import { useState } from 'react'
import { Link, useParams} from "react-router-dom";
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
import {v4 as uuid} from "uuid";
import _ from "lodash";
import axios from 'axios';


const UpdateNotes = ( ) => {
  const noteId = useParams()

  // here i'm getting data from localStorage
const getlocalAddItem =( )=>{
  if (noteId.id !== "new"){
    let data3 = JSON.parse(localStorage.getItem(noteId.id))
    // console.log("localStorageMatchedDataWithNoteId:",data3)
    let data4 = data3[1].DATA.filter((x,i)=>!x.isChecked)
    return data4    

  } else if (noteId.id === "new"){
    return []
  }
}

  // here i'm getting data from localStorage
  const getlocalArchiveData =( )=>{
    if (noteId.id !== "new"){
      let data3 = JSON.parse(localStorage.getItem(noteId.id))
      // console.log("localStorageMatchedDataWithNoteId:",data3)
      let data4 = data3[1].DATA.filter((x,i)=>x.isChecked)

      return data4    
  
    } else if (noteId.id === "new"){
      return []
    }
  }

//geting old title if any
const getDataForTitle =( )=>{
  if (noteId.id !== "new"){
    let data3 = JSON.parse(localStorage.getItem(noteId.id))
    let data4 = data3[2]?.title
    return data4    

  } else if (noteId.id === "new"){
    return []
  }
}

  const [id, setId] = useState("")
  const [addItem, setAddItem] = useState(getlocalAddItem)
  const [title, setTitle] = useState(getDataForTitle)
  const [archiveNotes, setArchiveNotes] = useState(getlocalArchiveData)
  const [toggleState, setToggleState] = useState(false)
  const [showDataInButton, setShowDataInButton] = useState("Show Archived")

  useEffect(() => {
    setId(`notesAppKey${uuid()}`)
  }, [])
  // console.log(id)

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
        [name] : value,
        date: `${moment().format('ddd ,D MMMM YY, hh:mm a')}`
      } 
    })
  }

  //adding new note
  const addEvent =()=>{
    setAddItem((prevData)=>{
      return [...prevData, note]
    });
    setNotes({
      name: "",
      amount: ""
    })
  }

    //deleting note
    const onDelete =(id)=>{
      let a = window.confirm("Are you sure?")
      if(a){
                setAddItem((prevData)=>{
                  return _.filter(prevData, (i,j)=>{
                    return j !== id;  
                  })
                }
                  ) 
      }else{
        return;
      }         
    }


    const onArchiveDelete =(id)=>{
      let a = window.confirm("Are you sure?")
      if(a){
                setArchiveNotes((prevData)=>{
                  return _.filter(prevData, (i,j)=>{
                    return j !== id;  
                  })
                }
                  ) 
      }else{
        return;
      }         
    }

    // sum part.........................
    let store= _.map(addItem, (x, i)=>{
      return  Number(x.amount)
    })
    let sum = store.reduce((a,b)=>a+b, 0)

    //updating notes
    const savedContentChange =(e,index)=>{
      const name = e.target.name;
      const value = e.target.value;
      setAddItem((prevData)=>{
        // console.log("prevData:", prevData)
        const updatedPrevData = prevData.map((pData,i)=>(
          i===index?
          {
            ...pData, 
            [name]: value,
          
        } : {...pData}));
        return [...updatedPrevData]
      });
    }

    //add data to unique "key" in localStorage
    const addKey=()=>{
      let data1 = _.concat(addItem, archiveNotes)
      console.log("data1:",data1)

      if (data1.length > 0){
        if (noteId.id === "new"){
          if(title?.length > 0){
            // let data2 = [{"ID":id}, {"DATA":data1},{title:title}]
            // localStorage.setItem(id,JSON.stringify(data2))
            axios.post(`http://foodapis.techenablers.info/api/notes`, {
              title: title,
              checklists: data1
            })
            .then(function (response) {
              console.log("post-new-response:",response);
            })
            .catch(function (error) {
              console.log("post-new-error:",error);
            });
          }else{
            // let data2 = [{"ID":id},{"DATA":data1}]
            // localStorage.setItem(id,JSON.stringify(data2))
            axios.post(`http://foodapis.techenablers.info/api/notes`, {
              title: "",
              checklists: data1
            })
            .then(function (response) {
              console.log("post-noTitle-new-response:",response);
            })
            .catch(function (error) {
              console.log("post-noTitle-new-error:",error);
            });
          }
        } else if (noteId.id !== "new"){
            if(title?.length > 0){
              let data5 = [{"ID":noteId.id}, {"DATA":data1},{title:title}]
              localStorage.setItem(noteId.id,JSON.stringify(data5))
            }else{
              let data5 = [{"ID":noteId.id},{"DATA":data1}]
              // localStorage.removeItem(noteId.id)
              localStorage.setItem(noteId.id,JSON.stringify(data5))
            }
        }
      }else if(data1.length === 0 && noteId.id === "new" && title?.length > 0){
          // let data2 = [{"ID":id}, {"DATA":[]},{title:title}]
          // localStorage.setItem(id,JSON.stringify(data2))
          axios.post(`http://foodapis.techenablers.info/api/notes`, {
              title: title,
              checklists: []
            })
            .then(function (response) {
              console.log("post-noChecklists-justTitle-new-response:",response);
            })
            .catch(function (error) {
              console.log("post-noChecklists-justTitle-new-error:",error);
            });
      }else{
        return;
      }
      setAddItem([])
    }

    //handling checkboxes
    const handleCheckboxes =(e,index)=>{

      // console.log("event:",e)
      // console.log("index:",index)
      // setCheckBox(e.target.value)

      const updatedNotes = addItem?.filter((x,i)=> i !== index)

        setAddItem(updatedNotes);

        setArchiveNotes(prevData => {
          return _.flattenDeep([...prevData, addItem?.filter((y,j)=>j === index).map(v => ({...v, status: 1}))])
        }
          )
    }

    // console.log("addItem:",addItem)
    // console.log("archiveNotes:",archiveNotes)

    //handling Archivedcheckboxes
    localStorage.setItem("archiveNotes",JSON.stringify(archiveNotes))
    const handleUnArchivedCheckboxes =(e,index)=>{
      // console.log("event:",e)
      // console.log("index:",index)
      // setCheckBox(e.target.value)
      const updateArchiveNotes = archiveNotes.filter((x,i)=> i !== index)
        setArchiveNotes(updateArchiveNotes);
        setAddItem(prevData => {
          return _.flattenDeep([...prevData, JSON.parse(localStorage.getItem("archiveNotes")).filter((y,j)=>j === index).map(({name, amount, date}) => ({name, amount, date}))])
        }
          )
    }
     // Archive notes sum part.........................
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
            <Link className='back__arrow3__4' to="/" onClick={addKey}><BiArrowBack className='back__arrow4' /></Link>
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

{/* saved data part on update page */}
    {/* {
      _.map(addItem, (val, index)=>{
        
        return <Note 
              key={index}
              id ={index}
              title={val.title}
              content={val.content}
              amount={val.amount}
              date={val.date}
              deleteItem= {onDelete}
            />
      })
    } */}


    {
    _.map(addItem, (val, index)=>{
      return <Container className='enterData1' key={index}>
      <Row className='enterData2'>
      
          <Col xs={1} className='checkbox__1'>     
          <input checked={false} type="checkbox" onChange={(e)=>handleCheckboxes(e,index)} className='checkbox' />
          </Col>

          <Col xs={8} className='input__content'>     
            <textarea 
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
            
            className='close__button' onClick={()=>onDelete(index)}> <IoCloseSharp className='close__button__background' /> </button>
          </Col>
          <Col xs={11} className='date__col__input'>
          <Row className='date__row__input'> 
              {moment().format('ddd ,D MMMM YY, hh:mm a')} 
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
      return <Container className='enterData1' key={index}>
      <Row className='enterData2'>
      
          <Col xs={1} className='checkbox__1'>     
          <input checked type="checkbox" onChange={(e)=>handleUnArchivedCheckboxes(e,index)} className='checkbox' />
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
            
            className='close__button' onClick={()=>onArchiveDelete(index)}> <IoCloseSharp className='close__button__background' /> </button>
          </Col>
          <Col xs={11} className='date__col__input'>
          <Row className='date__row__input'> 
              {moment().format('ddd ,D MMMM YY, hh:mm a')} 
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