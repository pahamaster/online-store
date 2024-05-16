import React, {useState, useEffect, useContext } from 'react';
import {Row, Col, Container, Image, Card, Button, Tabs, Tab, Form} from 'react-bootstrap';
import bigStar from '../assets/bigStar.png';
import {useParams} from 'react-router-dom';
import {fetchOneDevice, createBasketDevice, fetchRating, fetchRate, 
  fetchBasketDevices, updateDevice} from '../http/deviceApi';
import {Context} from '../index';
import RateModal from '../components/modals/Rate';
import DeviceModal from '../components/modals/Device';
import ReviewModal from '../components/modals/Review';
import {observer} from 'mobx-react-lite';
import Reviews from '../components/Reviews';
import {formatRub, getLocalBasketDevices, setLocalBasketDevices} from '../utils/utils';

const DevicePage=observer(()=>{
  const [deviceVisible, setDeviceVisible]=useState(false);
  const [reviewVisible, setReviewVisible]=useState(false);
  const {basket, user, ui} = useContext(Context);
  const [device, setDevice] = useState({ info: [] });
  const [rateVisible, setRateVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [rate, setRate] = useState();
  const [addCount, setAddCount]=useState(1);
  const { id } = useParams();
  
  useEffect(()=>{
    if (!ui.keyDevicePageTab) ui.setKeyDevicePageTab('infos');
    fetchOneDevice(id).then(data=>{
      setDevice(data);
    });
    if (user.isAuth) fetchRate(id).then(data=>setRate(data));
    fetchRating(id).then(data => setRating(Math.round(data * 10) / 10));
  }, []);

  const addBasketDevice=()=>{
    if (user.isAuth) {
      createBasketDevice({deviceId: device.id}).then(()=>{
        return fetchBasketDevices(user.id);
      }).then(data=>{
          basket.setBasketDevices(data.rows);
          basket.setCount(data.count);
      }).catch(e=>{
        alert(e.response.data.message);
      });
    }
    else {
      let bDevices=getLocalBasketDevices();
      let i=bDevices.findIndex(item=>item.deviceId===id);
      if (i==-1) bDevices.push({deviceId: id, count: 1}); else bDevices[i].count++;
      basket.setCount(bDevices.length);
      setLocalBasketDevices(bDevices);
    }
  };

  const appendCount=()=>{
    const formData=new FormData();
    formData.append('id', device.id);
    formData.append('addCount', addCount);
    updateDevice(formData).then(c=>{
      if (c) {
        setAddCount(1);
        fetchOneDevice(id).then(data => setDevice(data));
      } else alert('Товара #'+id+' не существует');
    }).catch(e=>{
      alert(e.response.data.message)
    });
  }

  return (
    <Container className='mt-3'>
      <Row>
        <Col md='4' className='mb-2'>
          <Image width={300} height={300} src={process.env.REACT_APP_API_URL + device.img} style={{objectFit: 'contain'}}/>
        </Col>
        <Col md='4'>
          <Row className='d-flex flex-column align-items-center'>
            <h2>{device?.brand?.name+' '+device?.name}</h2>
            <div
              className='d-flex align-items-center justify-content-center'
              style={{
                background: `url(${bigStar}) no-repeat center center`,
                width: 240,
                height: 240,
                backgroundSize: 'contain',
                fontSize: 64
              }}
            >
              {rating}
            </div>
            {user?.user?.role==='ADMIN' && 
                <Col className='mt-2 d-flex'>
                  <Form.Control
                    style={{width: 100}}
                    type='number' 
                    value={addCount}
                    onChange={e=>setAddCount(e.target.value>1 ? +e.target.value : 1)}
                  />
                  <Button variant='outline-dark' onClick={appendCount}>Добавить на склад</Button>
                </Col>
              }
          </Row>
        </Col>
        <Col md='4'>
          <Card
            className='d-flex flex-column align-items-center justify-content-between'
            style={{ width: 300, height: 300, fontSize: 32, border: '5px solid lightgrey' }}
          >
            <h3 className='mt-2'>От: {formatRub(device.price)}</h3>
            <h3 className='mt-2'>{device.count ? 'На складе: '+device.count+' шт.' : 'Нет в наличии'}</h3>
            <Row className='mb-3 d-flex align-items-center flex-column'>
              {device.count>0 && <Button variant='outline-dark' onClick={addBasketDevice}>Добавить в корзину</Button>}
              <Button variant='outline-dark' className='mt-2' onClick={()=>setReviewVisible(true)}>Оставить отзыв</Button>
              {rate ? <div style={{ fontSize: 20, textAlign: 'center' }} className='mt-2'>{'Ваша оценка: ' + rate}</div> :
                <Button variant='outline-dark' className='mt-2' onClick={() => setRateVisible(true)}>Оценить</Button>
              }
              {user?.user?.role==='ADMIN' && 
                <Button variant='outline-dark' className='mt-2' onClick={()=>setDeviceVisible(true)}>Редактировать</Button>}
            </Row>
          </Card>
        </Col>
      </Row>
      <Tabs 
        id="controlled-tab-example"
        activeKey={ui.keyDevicePageTab}
        onSelect={k=>ui.setKeyDevicePageTab(k)}
        className="mt-3"
      >
        <Tab eventKey="infos" title="Характеристики">
          <Row className='d-flex flex-column m-3'>
            {device.info.map((info, i) =>
              <Row key={i} style={{ background: i % 2 ? 'transparent' : 'lightgrey' }} className='p-2'>
                {info.title}: {info.description}
              </Row>
            )}
          </Row>
        </Tab>
        <Tab eventKey="reviews" title="Отзывы">
          <Reviews deviceId={id}/>
        </Tab>
      </Tabs>
      
      <RateModal show={rateVisible} onHide={(updateRate) => {
        setRateVisible(false);
        if (updateRate!==null) setRate(updateRate);
        fetchRating(id).then(data => setRating(Math.round(data * 10) / 10));
      }} deviceId={id} />
      <DeviceModal id={id} show={deviceVisible} onHide={()=>{
        fetchOneDevice(id).then(data => setDevice(data));
        setDeviceVisible(false);
      }}/>
      <ReviewModal deviceId={id} show={reviewVisible} onHide={()=>{
        // fetchReviewsByDeviceId(id).then(data => setReviews(data));
        setReviewVisible(false);
      }}/>
    </Container>
  )
})

export default DevicePage;