import React, {useState, useEffect, useContext} from 'react';
import {Row, Col, Container, Dropdown} from 'react-bootstrap';
import {Context} from '../index';
import {observer} from 'mobx-react-lite';
//import {deleteBasketDevice} from '../http/deviceApi';
import {fetchAdminOrders} from '../http/deviceApi';
//import {useHistory} from 'react-router-dom';
//import {DEVICE_ROUTE} from '../utils/consts';
//import {createOrder} from '../http/deviceApi';
import '../css/rowhover.css';
import OrderModal from '../components/modals/Order';
import Paginations from '../components/Paginations';
import {formatDate, formatRub} from '../utils/utils'; 

const Orders=observer(()=>{
  const {order, ui}=useContext(Context);
  
  //const history=useHistory();
  const ordersDisplayMethod=[
    'Все',
    'Моё сопровождение',
    'Моё сопровождение законченные',
    'Моё сопровождение незаконченные и без сопровождения',
    'Без сопровождения',
  ];
  const [selectedOrdersDisplayMethod, setSelectedOrdersDisplayMethod]=useState(0);


  useEffect(()=>{
    fetchAdminOrders({page: order.page, limit: order.limit, displayMethod: selectedOrdersDisplayMethod}).then(data=>{
      order.setTotalCount(data.count);
      order.setOrders(data.rows);
    }).catch(e=>alert(e.response.data.message));
  }, [order.page, order.limit, order.fUpdate]);

  return (
      <Container className='mt-3'>
        <Row  style={{whiteSpace: 'nowrap'}} className='d-flex flex-column m-3'>
          <Col style={{display: 'flex', justifyContent: 'space-between'}}>
            <h2>{order?.orders?.length ? 'Заказы' : 'Заказов нет'}</h2>
            <Dropdown>
              <Dropdown.Toggle>{ordersDisplayMethod[selectedOrdersDisplayMethod]}</Dropdown.Toggle>
              <Dropdown.Menu style={{overflow: 'auto', maxHeight: '400px'}}>
                {ordersDisplayMethod.map((item, i)=>
                  <Dropdown.Item 
                    onClick={()=>{setSelectedOrdersDisplayMethod(i); order.setFUpdate(); order.setPage(1)}} 
                    key={item}>
                      {item}
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          {order?.orders?.map((item, i)=>
              <Row 
                className='p-2 d-flex align-items-center rowhover'
                onClick={e=>{
                  if (e.target.nodeName==='DIV') {
                    //console.log(item.id);
                    order.setOrderId(item.id);
                    ui.setOrderModalVisible(true);
                  }
                }}
              >
                <Col>{'#'+item.id+'. '+formatDate(item.createdAt)}</Col>
                
                <Col>{item.user_email}</Col>
                <Col>{formatRub(item.sum)}</Col>
                <Col>Adm: {item?.admin_email}</Col>
                <Col>
                  {item.status_namerus}: {formatDate(item.status_createdAt)}
                </Col>
              </Row>
          )}
        </Row>
        <Paginations
          pageCount={Math.ceil(order.totalCount/order.limit)}
          page={order.page}
          changePage={p=>order.setPage(p)}
        />
        <OrderModal show={ui.orderModalVisible} onHide={()=>{
          ui.setOrderModalVisible(false);
        }}/>
    </Container>
  )
});

export default Orders;