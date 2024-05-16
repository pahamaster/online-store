import React, {useState, useEffect, useContext} from 'react';
import {Container, Button, Form, Row, ListGroup} from 'react-bootstrap';
//import CreateType from '../components/modals/CreateType';
import DeviceModal from '../components/modals/Device';
import UsersModal from '../components/modals/Users';
import BrandTypeModal from '../components/modals/BrandType';
import {useHistory} from 'react-router-dom';
import {ORDERS_ROUTE} from '../utils/consts';
import {Context} from '../index';
import {fetchTypes, fetchBrands, fetchDevicesExport, 
  create, createDevice, fetchInfos, createInfo} from '../http/deviceApi.js';

const Admin=()=>{
  const history=useHistory();
  const [brandVisible, setBrandVisible]=useState(false);
  const [deviceVisible, setDeviceVisible]=useState(false);
  const [typeVisible, setTypeVisible]=useState(false);
  const [usersVisible, setUsersVisible]=useState(false);
  const [files, setFiles]=useState('');
  const [changeF, setChangeF]=useState(false); 
  const {device, order}=useContext(Context);
  const typesFile='types.txt', brandsFile='brands.txt', devicesFile='devices.txt',
    infosFile='infos.txt';
  const eNames=[typesFile, brandsFile, devicesFile, infosFile]; 

  useEffect(()=>{
    fetchTypes().then(data=>{
      device.setTypes(data);
      return fetchBrands();
    }).then(data=>{
      device.setBrands(data);
    }).catch(e=>alert(e.response.data.message));
  }, [changeF]);

  const exportBase=()=>{
    fetchTypes().then(data=>{
      const typeExport=data.map(item=>{
        return {id:item.id, name: item.name}
      });
      saveJSON(typeExport, typesFile);
    });
    fetchBrands().then(data=>{
      const brandExport=data.map(item=>{
        return {id:item.id, name: item.name}
      });
      saveJSON(brandExport, brandsFile);
    });
    fetchDevicesExport().then(data=>{
      const deviceExport=data;
      saveJSON(deviceExport, devicesFile);
    }).catch(e=>alert(e.response.data.message));
    fetchInfos().then(data=>{
      saveJSON(data, infosFile);
      alert('Экспорт успешно произведен в файлы '+eNames.join(' '));
    }).catch(e=>alert(e.response.data.message));
  }

  function saveJSON(content, fileName) {
    const a = document.createElement("a");
    const file = new Blob([JSON.stringify(content, null, 2)], {type: 'text/plain'});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  const readJSON=(file)=>{
    return new Promise((resolve, reject)=>{
      let reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function() {
        resolve(JSON.parse(reader.result));
      };
      reader.onerror = function() {
        reject(reader.error);
      };
    })
    
  }

  const getSortedFiles=()=>{
    const result=[];
    for(let i=0; i<eNames.length; i++) {
      for (let k=0; k<eNames.length; k++) if (files[k].name===eNames[i]) result.push(files[k]);
    }
    return result;
  }

  const importBase=async ()=>{
    let eFiles=[];
    try {
      eFiles=getSortedFiles();
    } catch (e) {alert('Выберите файлы '+eNames.join(' ')); return}
    if (eFiles.length!==eNames.length) {alert('Выберите файлы '+eNames.join(' ')); return}
    try {
      const types=await readJSON(eFiles[0]);
      const newTypes=[];
      for (const type of types) {
        const newType=await create('type', type);
        newTypes.push(newType); 
      }
      
      const brands=await readJSON(eFiles[1]);
      const newBrands=[];
      for (const brand of brands) {
        const newBrand=await create('brand', brand);
        newBrands.push(newBrand); 
      }
      const devices=await readJSON(eFiles[2]);

      const infos=await readJSON(eFiles[3]);

      //const newDevices=[];
      for (const device of devices) {
        const it=types.findIndex(type=>type.id===device.typeId);
        const typeId=newTypes[it].id;
        const ib=brands.findIndex(brand=>brand.id===device.brandId);
        const brandId=newBrands[ib].id;
        const info=infos.filter(item=>device.id===item.deviceId);
        await createDevice({...device, fileName: device.img, typeId, brandId, info: JSON.stringify(info)});
        //newDevices.push(newDevice);
      }
      setChangeF(!changeF);
      alert('Импорт успешно завершен');
    } catch (e) {alert(e.response.data.message)}
  }

  return (
    <Container className='d-flex flex-column'>
      <Button 
        variant='outline-dark' 
        className='mt-2'
        onClick={()=>{order.setPage(1); history.push(ORDERS_ROUTE)}}
        >Заказы</Button>
      <Button 
        variant='outline-dark' 
        className='mt-2'
        onClick={()=>setTypeVisible(true)}
        >Работа с типами</Button>
      <Button 
        variant='outline-dark' 
        onClick={()=>setBrandVisible(true)}
        className='mt-2'
        >Работа с брендами</Button>
      <Button 
        variant='outline-dark' 
        className='mt-2'
        onClick={()=>setDeviceVisible(true)}
        >Добавить устройство</Button>
      <Button 
        variant='outline-dark' 
        className='mt-2'
        onClick={()=>setUsersVisible(true)}
        >Работа с пользователями</Button>
      <Button 
        variant='outline-dark' 
        className='mt-2'
        onClick={exportBase}
        >Экспорт базы</Button>
      <ListGroup.Item className='d-flex align-items-center mt-2'>
        <Button 
          variant='outline-dark' 
          onClick={importBase}
          style={{whiteSpace: 'nowrap', marginRight: 20}}
          >Импорт базы
        </Button>
        <Form.Control 
          type='file'
          multiple
          onChange={e=>setFiles(e.target.files)}
        />
      </ListGroup.Item>
      <BrandTypeModal what={'brand'} show={brandVisible} onHide={()=>
        setBrandVisible(false)
      }/>
      <DeviceModal show={deviceVisible} onHide={()=>{
        setDeviceVisible(false);
      }}/>
      <BrandTypeModal what={'type'} show={typeVisible} onHide={()=>
        setTypeVisible(false)
      }/>
      <UsersModal show={usersVisible} onHide={()=>
        setUsersVisible(false)
      }/>
    </Container>
  )
}

export default Admin;