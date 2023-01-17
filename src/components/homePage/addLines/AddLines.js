import React from 'react'
import { Row } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom';
import "../addLines/addLines.css";
// import _ from "lodash";

const AddLines = (props) => {
  const Navigate = useNavigate()

  console.log("props.myData:",props.myData)
  
  return (
    <>
    {
      props.myData.checklists.map((y,j)=>{
        const {id, name, amount, status} = y
        return   <Col xs={12} key={id} className="main__colll" onClick={()=>Navigate(`UpdateNotes/${props.myData.id}`)}>
        <Row className='ssRow'>
              <Col xs={2} className="checkBox__col"> 
                    <input 
                        id={j} 
                        checked={status}
                        readOnly
                        type="checkbox" 
                        className="checkBox" 
                    />  
              </Col>
             
              <Col xs={6} 
                  
                  onClick={()=>Navigate(`UpdateNotes/${props.myData.id}`)} 
                  className="content bg" > 
                  {name} 
              </Col>

              <Col xs={3} onClick={()=>Navigate(`UpdateNotes/${props.myData.id}`)} className="amount bg"> 
                {amount} 
              </Col>
      </Row>
      </Col>
      })  
      }
    
    </>
  )
}

export default AddLines;