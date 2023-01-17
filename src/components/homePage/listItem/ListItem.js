import React, { useState } from 'react'
import AddLines from '../addLines/AddLines'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { BsThreeDotsVertical } from 'react-icons/bs';
import "../listItem/listItem.css";
import { useNavigate } from 'react-router-dom';
import { NavDropdown } from 'react-bootstrap';
import axios from 'axios';


import { RWebShare } from "react-web-share";



const ListItem = (props) => {
  const [shareData, setShareData] = useState([])
  
  const navigate=useNavigate()
  let query = props.query

  const deleteThisNote=(e)=>{
   let boxId = e.currentTarget.id

  console.log("boxId:",boxId)
  axios.delete(`http://foodapis.techenablers.info/api/notes/${boxId}`)
   .then((res)=>{
    console.log("delete-note-res:",res)
    axios.get(`http://foodapis.techenablers.info/api/notes`)
    .then((response)=>{
      console.log("get-res-after-dlt-note:",response)
      
      props.refresh(response.data.data.notes)
    })
   })
  }

   const shareThisNote=(id)=>{
    let boxId = id
 
   console.log("shareBoxId:",boxId)
   axios.get(`http://foodapis.techenablers.info/api/notes/${boxId}`)
    .then((res)=>{
     console.log("share-this-note-res:",res)
     setShareData(res.data.data.note)
    })
   }

console.log("shareData", shareData)

  
  let myData = props.x
  return (
    <>
  
          <Col xs={5} className="col1 bg">
            
            <Row className='row1 bg'>
                <Col xs={8} onClick={()=>navigate(`UpdateNotes/${props.x.id}`)} className="title bg"> 
                    {props.x?.title} 
                </Col>
                <Col xs={4} className="col__3__dots"> 

                  <NavDropdown  title={<button 
                                type="submit" 
                                className='dotButton'>
                                <BsThreeDotsVertical className="dotIcon" />
                                </button>} 
                                id="basic-nav-dropdown" 
                                className="navDrop">

                        <NavDropdown.Item
                            onClick={()=>navigate(`UpdateNotes/${props.x.id}`)}
                            id={props.x.id} 
                            className='navItem'>
                            Edit
                        </NavDropdown.Item>

                        <NavDropdown.Item
                            onClick={deleteThisNote}
                            id={props.x.id} 
                            className='navItem'>
                            Delete
                        </NavDropdown.Item>

                        <NavDropdown.Item>
                           <div className='shareButtonFull'>
                           <RWebShare
                           
                             data={{
                               text: JSON.stringify(shareData?.checklists?.map((a)=>{
                                return {
                                  "Name":a.name,
                                  "Amount":a.amount,
                                  "Checked":a.status
                                }})),
                               url: "https://on.natgeo.com/2zHaNup",
                               title: shareData.title,
                             }}
                             onClick={()=>shareThisNote(props.x.id)}
                             
                           >
                             <button className='shareButton'>
                              Share
                              </button>
                           </RWebShare>
                         </div>
        
                        </NavDropdown.Item>

                  </NavDropdown>
                </Col>
        {/* iterate from here for new checkbox lines */}
            
            <AddLines myData={myData} query={query} />

            </Row>
          
        </Col>

        
      
    </>
  )
}

export default ListItem;