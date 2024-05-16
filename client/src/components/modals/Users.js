import React, {useState, useContext, useEffect} from 'react';
import {Modal, Button, Form, ListGroup, Col} from 'react-bootstrap';
import {fetch, updateUser} from '../../http/userApi';
import {Context} from '../../index';


const UsersModal=({show, onHide})=>{
  function isMatching(full, chunk) {
    return full?.toLowerCase()?.includes(chunk?.trim()?.toLowerCase());
  }
  const {user}=useContext(Context);
  const [users, setUsers]=useState([]);
  const [filteredUsers, setFilteredUsers]=useState([]);
  const [value, setValue]=useState('');

  useEffect(()=>{
    fetch().then(data=>{
      setUsers(data.filter(item=>item.id!==user.user.id));
    })
  }, []);

  useEffect(()=>{
    filter();
  }, [value, users]);

  const filter=()=>{
    if (value.length>0) 
      setFilteredUsers(users.filter(item=>isMatching(item?.email, value)));
    else setFilteredUsers(users);
  }

  const changeUser=(freak)=>{
    if (freak.id!==user.user.id) {
      const role=freak.role;
      let newRole;
      if (role==='ADMIN') newRole='USER';
      if (role==='USER') newRole='ADMIN';
      if (newRole) updateUser({id: freak.id, role: newRole}).then(count=>{
        if (count) setUsers(users.map(item=>{return freak===item ? {...item, role: newRole} : item}));
        else alert('Пользователя #'+freak.id+' не существует');
      });
    }
  }

  const toHide=()=>{
    setValue('');
    onHide();
  }

  return (
    <Modal
      show={show}
      onHide={toHide}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Пользователи
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <ListGroup className='mt-2' style={{overflow: 'auto', maxHeight: '400px'}}>
              {filteredUsers.map(item=>
                <ListGroup.Item
                  className='d-flex align-items-center'
                  key={item.id}
                  id={item.id}
                  onClick={e=>{e.preventDefault();}}
                >
                  <Col style={{marginRight: 10, whiteSpace: 'nowrap'}}>{item.email}</Col>
                  <Col style={{marginRight: 10, whiteSpace: 'nowrap'}}>{item.role}</Col>
                  <Button variant='outline-danger' onClick={e=>changeUser(item)}>Сменить роль</Button>
                </ListGroup.Item>
              )}
            </ListGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer className='d-flex flex-nowrap'>
        <Form.Control
          placeHolder='Введите для поиска'
          value={value}
          onChange={e=>{
            setValue(e.target.value);
          }}
        />
        <Button variant='outline-danger' onClick={()=>toHide()}>Закрыть</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UsersModal;