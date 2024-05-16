import React, {useState, useContext, useEffect} from 'react';
import {Modal, Button, Form, ListGroup} from 'react-bootstrap';
import {create, fetch, update} from '../../http/deviceApi';
import {Context} from '../../index';


const BrandType=({show, onHide, what})=>{
  function isMatching(full, chunk) {
    return full?.toLowerCase()?.includes(chunk?.trim()?.toLowerCase());
  }
  //const [selected, setSelected]=useState(null);
  const {device}=useContext(Context);
  const [filtered, setFiltered]=useState([]);
  const [value, setValue]=useState('');
  let caption='';
  if (what==='type') caption='Типы';
  if (what==='brand') caption='Бренды';

  useEffect(()=>{
    fetch(what).then(data=>{
      device.set(what, data);
      setValue('');
      setFiltered(device[what+'s']);
    })
  }, [what, device]);

  useEffect(()=>{
    filter();
  }, [value]);

  const change=how=>{
    if (how.name.trim())
      update(what, how).then(count=>{
        if (count)
          fetch(what).then(data=>{
            device.set(what, data);
            filter();
          });
        else alert('Бренда/типа #'+what.id+' не существует');
      }).catch(e=>alert(e.response.data.message));
    else alert('Введите название');
  }

  const filter=()=>{
    if (value.length) 
      setFiltered(device[what+'s'].filter(item=>isMatching(item.name, value)));
    else setFiltered(device[what+'s']);
  }

  const add=()=>{
    if (value.trim())
      create(what, {name: value}).then(data=>{
        setValue('');
        device[what+'s'].push(data);
        setFiltered(device[what+'s']);
        //onHide(data);
      }).catch(e=>alert(e.response.data.message)) ;
    else alert('Введите наименование');
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
        <Modal.Title id="contained-modal-title-vcenter">
          {caption}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <ListGroup className='mt-2' style={{overflow: 'auto', maxHeight: '400px'}}>
            {filtered.map(item=>
              <ListGroup.Item
                className='d-flex align-items-center'
                key={item.id}
                id={item.id}
                onClick={e=>{e.preventDefault();}}>
                  <div style={{marginRight: 10, whiteSpace: 'nowrap'}}>{item.name}</div>
                  <Form.Control
                    className='ml-2'
                    defaultValue={item.name}
                  />
                  <Button variant='outline-danger'
                    onClick={e=>{
                      const id=e.target.parentElement.id;
                      const name=e.target.previousElementSibling.value;
                      change({id, name});
                    }}
                  >
                    Сохранить</Button>
              </ListGroup.Item>
            )}
          </ListGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer className='d-flex flex-nowrap'>
        <Form.Control
          placeHolder='Введите для поиска'
          value={value}
          onChange={e=>setValue(e.target.value)}
        />
        <Button variant='outline-danger' onClick={()=>toHide()}>Закрыть</Button>
        <Button variant='outline-success' onClick={add}>Добавить</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BrandType;