import React, {useState, useContext} from 'react';
import {Modal, Button, Form, Dropdown} from 'react-bootstrap';
import {createRating} from '../../http/deviceApi';
import {Context} from '../../index.js';

const Rate=({show, onHide, deviceId})=>{
  const {user}=useContext(Context);
  const [selectedRate, setSelectedRate]=useState();
  const arr=[1,2,3,4,5,6,7,8,9,10];
  const setRate=()=>{
    createRating(deviceId, selectedRate).then(()=>{
      setSelectedRate(null);
      onHide(selectedRate);
    }).catch(e=>alert(e.response.data.message));
  }
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Поставить оценку
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {user.isAuth ? (
            <Dropdown>
              <Dropdown.Toggle>{selectedRate || 'Выберите оценку'}</Dropdown.Toggle>
              <Dropdown.Menu>
                {arr.map(i=> 
                  <Dropdown.Item 
                    onClick={()=>{setSelectedRate(i)}} 
                    key={i}>
                      {i}
                  </Dropdown.Item>
                )}
              </Dropdown.Menu> 
            </Dropdown>) : <div style={{fontSize: 18}}>Для того, чтобы поставить оценку, войдите или зарегистрируйтесь.</div>
          }
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='outline-danger' onClick={()=>onHide()}>Закрыть</Button>
        {user.isAuth ? <Button variant='outline-success' onClick={setRate}>Оценить</Button> : null}
      </Modal.Footer>
    </Modal>
  );
};

export default Rate;