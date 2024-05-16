import React, {useContext, useState} from 'react';
import {Modal, Button, Form, Dropdown, Col, Row, Image} from 'react-bootstrap';
import {Context} from '../../index';
import {observer} from 'mobx-react-lite';
import {createDevice, updateDevice, fetchOneDevice} from '../../http/deviceApi';

const autoI={n:0, 
  get i() {return this.n++}
}

const DeviceModal=observer(({show, onHide, id})=>{
  const {device}=useContext(Context);
  //const [deviceOne, setDeviceOne] = useState({ info: [] });
  const [info, setInfo]=useState([]);
  const [name, setName]=useState('');
  const [price, setPrice]=useState(0);
  const [selectedBrand, setSelectedBrand]=useState(null);
  const [selectedType, setSelectedType]=useState(null);
  const [file, setFile]=useState(null);
  const [fileName, setFileName]=useState('');
  const [infoForDelete, setInfoForDelete]=useState([]);
  
  const onShow=()=>{
    setName('');
    setInfo([]);
    setInfoForDelete([]);
    setFile(null);
    setSelectedType(null);
    setSelectedBrand(null);
    setFileName('');
    setPrice(0);
    if (id) {
      fetchOneDevice(id).then(data=>{
        //setDeviceOne(data);
        setSelectedType(data.type);
        setSelectedBrand(data.brand);
        setName(data.name);
        setPrice(data.price);
        setFileName(data.img);
        setInfo(data.info.map(i=>{return {...i, number: autoI.i}}));
      });
    }
  }

  const addInfo=()=>{
    setInfo([...info, {title: '', description: '', number: autoI.i}]);
  }

  const removeInfo=(infoObj)=>{
    let number=infoObj.number;
    if (infoObj?.id) infoForDelete.push(infoObj.id);
    setInfo(info.filter(i=>i.number!==number));
  }

  const selectFile=e=>{
    //console.log(e.target.files[0]);
    setFile(e.target.files[0]);
  }

  const changeInfo=(key, value, number)=>{
    setInfo(info.map(i=>i.number===number ? {...i, [key]: value} : i));
  }

  const addDevice=()=>{
    if (name.trim()) {
      const formData=new FormData();
      formData.append('name', name);
      formData.append('price', `${price}`);
      formData.append('img', file);
      formData.append('fileName', fileName);
      formData.append('brandId', selectedBrand?.id);
      formData.append('typeId', selectedType?.id);
      formData.append('info', JSON.stringify(info));
      createDevice(formData).then(()=>{
        onHide();
      }).catch(e=>{alert(e.response.data.message)});
    } else alert ('Введите наименование товара');
  }

  const changeDevice=()=>{
    const formData=new FormData();
    formData.append('id', id);
    formData.append('name', name);
    formData.append('price', `${price}`);
    formData.append('img', file);
    formData.append('brandId', selectedBrand.id);
    formData.append('typeId', selectedType.id);
    formData.append('info', JSON.stringify(info));
    formData.append('infoForDelete', JSON.stringify(infoForDelete));
    updateDevice(formData).then(count=>{
      device.setFUpdate();
      onHide();
    }).catch(e=>{
      alert(e.response.data.message)
    });
  }
  
  return (
    <Modal
      onShow={onShow}
      show={show}
      onHide={onHide}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Устройство #{id ? id : null}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row class='d-flex'>
            <Col md='4' className='mb-2'>
              <Dropdown>
                <Dropdown.Toggle>{selectedType?.name || 'Выберите тип'}</Dropdown.Toggle>
                <Dropdown.Menu style={{overflow: 'auto', maxHeight: '400px'}}>
                  {device.types.map(type=>
                    <Dropdown.Item 
                      onClick={()=>setSelectedType(type)} 
                      key={type.id}>
                        {type.name}
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown className='mt-2'>
                <Dropdown.Toggle>{selectedBrand?.name || 'Выберите брэнд'}</Dropdown.Toggle>
                <Dropdown.Menu style={{overflow: 'auto', maxHeight: '400px'}}>
                  {device.brands.map(brand=>
                    <Dropdown.Item 
                      onClick={()=>setSelectedBrand(brand)} 
                      key={brand.id}>
                        {brand.name}
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col md='4' className='mb-2'>
              <Image 
                width={100} 
                height={100} style={{objectFit: 'contain'}} 
                src={(file===null) ? process.env.REACT_APP_API_URL +  fileName : window.URL.createObjectURL(file)} 
              />
            </Col>
          </Row>
          <Form.Control
            className='mt-3'
            placeholder='Введите название устройства' 
            value={name}
            onChange={e=>setName(e.target.value)}
          />
          <Form.Control
            className='mt-3'
            placeholder='Введите стоимость устройства'  
            type='number' 
            value={price}
            onChange={e=>setPrice(+e.target.value)}
          />
          <Form.Control
            className='mt-3' 
            type='file'
            onChange={selectFile}
          />
          <hr/>
          <Button
            variant='outline-dark'
            onClick={addInfo}
          >
            Добавить новое свойство
          </Button>
          {info.map(i=>
            <Row className='mt-2' key={i.number}>
              <Col md='4'>
                <Form.Control
                  placeholder='Введите название свойства'
                  value={i.title}
                  onChange={e=>changeInfo('title', e.target.value, i.number)}
                />
              </Col>
              <Col md='4'>
                <Form.Control
                  placeholder='Введите описание'
                  value={i.description}
                  onChange={e=>changeInfo('description', e.target.value, i.number)}
                />
              </Col>
              <Col md='4'>
                <Button 
                  varinant='outline-danger'
                  onClick={()=>removeInfo(i)}
                >Удалить</Button>
              </Col>
            </Row>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='outline-danger' onClick={onHide}>Закрыть</Button>
        <Button variant='outline-success' onClick={addDevice}>Добавить</Button>
        {id ? <Button variant='outline-success' onClick={changeDevice}>Изменить</Button> : null}
      </Modal.Footer>
    </Modal>
  );
});

export default DeviceModal;