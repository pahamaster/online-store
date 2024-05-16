import React, {useState, useEffect, useContext} from 'react';
import {Row, Col, Container, Button, Form} from 'react-bootstrap';
import {Context} from '../index';
import {observer} from 'mobx-react-lite';
import {deleteBasketDevice} from '../http/deviceApi';
import {fetchBasketDevices, createBasketDevice, fetchOneDevice} from '../http/deviceApi';
import {useHistory} from 'react-router-dom';
import {DEVICE_ROUTE} from '../utils/consts';
import {createOrder} from '..//http/deviceApi';
import {formatRub} from '../utils/utils';
import {getLocalBasketDevices, setLocalBasketDevices} from '../utils/utils';

const Basket=observer(()=>{
  const {user, basket}=useContext(Context);
  const history=useHistory();

  useEffect(async ()=>{  //1
    if (user.isAuth) fetchBasketDevices(user.id).then(data=>{
      basket.setBasketDevices(data.rows);
      basket.setCount(data.count);
    }); 
    else {
      let bDevices=getLocalBasketDevices();
      let rows=[];
      for (const item of bDevices) {
        let data=await fetchOneDevice(item.deviceId);
        rows.push({deviceId: data.id, count: item.count, device: data});
      }
      basket.setBasketDevices(rows);
      basket.setCount(rows.length);
    }
  },[]);

  const removeBasketDevice=(id, deviceId)=>{
    if (user.isAuth)
      deleteBasketDevice(id).then(count=>{
        if (count) {
          basket.setCount(basket.count-1);
          basket.setBasketDevices(basket.basketDevices.filter(i=>(id!=i.id)));
        }
        else alert('Позиции #'+id+' в корзине нет!');
      }).catch(e=>alert(e.response.data.message));
    else {
      const bDevices=getLocalBasketDevices().filter(item=>(deviceId!=item.deviceId));
      setLocalBasketDevices(bDevices);
      basket.setCount(basket.count-1);
      basket.setBasketDevices(basket.basketDevices.filter(item=>(deviceId!=item.deviceId)));
    }
  }

  const changeCount=(basketDevice, newCount)=>{
    //let newCount=e.target.value;
    if (newCount<1) newCount=1;
    if (user.isAuth) {
      createBasketDevice({deviceId: basketDevice.device.id, count: newCount}).then(()=>{
        basketDevice.count=newCount;
      });
    } else {
      let bDevices=getLocalBasketDevices();
      bDevices.find(item=>item.deviceId==basketDevice.deviceId).count=newCount;
      basketDevice.count=newCount;
      setLocalBasketDevices(bDevices);
    }
  }
  
  const sendOrder=()=>{
    if (user.isAuth) {
      createOrder().then(data=>{
        basket.setBasketDevices([]);
        basket.setCount(0);
        alert('Ваш заказ поступил в обработку.');
      }).catch(e=>alert(e.response.data.message));
    } else alert('Для оформления заказа авторизуйтесь или зарегистрируйтесь.');
  }

  return (
    <div>
      <Container className='mt-3'>
        <Row className='d-flex flex-column m-3'>
          <h2>Корзина{!basket.count && ' пуста'}</h2>
          {basket.basketDevices.map((basketDevice, i)=>
            <Row 
              className={basketDevice.device.count<basketDevice.count 
                ? 'p-2 d-flex align-items-center rowpink'  : 'p-2 d-flex align-items-center rowhover'}
              onClick={e=>{
                if (e.target.nodeName==='DIV') history.push(DEVICE_ROUTE+'/'+basketDevice.deviceId)
              }}
            >
              <Col>{basketDevice.device.brand.name+' '+basketDevice.device.name}</Col>
              <Col>{formatRub(basketDevice.device.price)}</Col>
              <Col>
                <Form.Control
                  style={{width: 75}}
                  type='number' 
                  value={basketDevice.count}
                  onChange={e=>changeCount(basketDevice, e.target.value)}
                />
              </Col>
              <Col>
                  {`На складе ${basketDevice.device.count} шт.`}
              </Col>
              <Col className='d-flex justify-content-end'><Button onClick={()=>
                removeBasketDevice(basketDevice.id, basketDevice.deviceId)
              }>Удалить</Button></Col>
            </Row>
          )}
          {basket.count ? <Row className='p-2 mt-4' style={{fontSize: '32px'}}>
            <Col>Сумма заказа: {formatRub(basket.totalPrice)}</Col>
            <Col className='d-flex justify-content-end'><Button onClick={sendOrder} variant='danger' style={{fontSize: '22px'}}>Заказать</Button></Col>
          </Row> : null}
        </Row>
    </Container>
    </div>
  )
});

export default Basket;