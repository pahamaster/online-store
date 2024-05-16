import React, {useState, useEffect} from 'react';
import {Card, Col, Image} from 'react-bootstrap';
import star from '../assets/star.png';
import {useHistory} from 'react-router-dom';
import {DEVICE_ROUTE} from '../utils/consts';
import {fetchRating} from '../http/deviceApi';

const DeviceItem=({device})=>{
  const [rating, setRating]=useState(0);
  useEffect(() => fetchRating(device.id).then(data => setRating(Math.round(data * 10) / 10)), [device]);
  const history=useHistory();
  //console.log(typeId);
  return (
    <Col md='3' className='mt-3' onClick={()=>history.push(DEVICE_ROUTE+'/'+device.id)}>
      <Card style={{width: 150, cursor: 'pointer'}} border={'light'}>
        <Image width={150} height={150} src={process.env.REACT_APP_API_URL+device.img}  style={{objectFit: 'contain'}}/>
        <div className='mt-1 d-flex justify-content-between align-items-center'>
          <div className='text-black-50'>{device.brand.name}</div>
          <div className='d-flex align-items-center'>
            <div>{rating}</div>
            <Image width={18} height={18} src={star}/>
          </div>
        </div>
        <div>{device.name}</div>
      </Card>
    </Col>
    
  );
};

export default DeviceItem;