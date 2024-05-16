import React, {useState, useEffect, useContext} from 'react';
import {Row, Col, Container, Button, Form, OverlayTrigger} from 'react-bootstrap';
import {Context} from '../index';
import {observer} from 'mobx-react-lite';
//import {deleteBasketDevice} from '../http/deviceApi';
import {fetchAuthOrders} from '../http/deviceApi';
import {useHistory} from 'react-router-dom';
//import {DEVICE_ROUTE} from '../utils/consts';
//import {createOrder} from '../http/deviceApi';
import '../css/rowhover.css';
import MyOrderModal from '../components/modals/MyOrder';
import Paginations from '../components/Paginations';
import {formatDate, formatRub} from '../utils/utils'; 

const MyOrders=observer(()=>{
  const {order, ui}=useContext(Context);
  //const [myOrderModalVisible, setMyOrderModalVisible]=useState(false);
  //const [index, setIndex]=useState(null);
  //const history=useHistory();

  useEffect(()=>{
    fetchAuthOrders({page: order.page, limit: order.limit}).then(data=>{
      order.setMyOrders(data.rows);
      order.setTotalCount(data.count);
    }).catch(e=>alert(e?.response?.data?.message));
  }, [order.page, order.limit]);
  
  return (
      <Container className='mt-3'>
        <Row className='d-flex flex-column m-3'>
          <h2>{order?.myOrders?.length ? 'Мои заказы' : 'Заказов нет'}</h2>
          {order?.myOrders?.map((item, i)=>
            
              <Row 
                className='p-2 d-flex align-items-center rowhover'
                onClick={e=>{
                  if (e.target.nodeName==='DIV') {
                    order.setOrderId(item.id);
                    ui.setMyOrderModalVisible(true);
                  }
                }}
              >
                <Col>{'#'+item.id+'. '+formatDate(item.createdAt)}</Col>
                <Col>{formatRub(order.myOrdersTotalPrice(i))}</Col>
                  <Col style={{whiteSpace: 'nowrap'}}>
                    {item.order_statuses[0].status.namerus}: {formatDate(item.order_statuses[0].createdAt)}
                  </Col>
              </Row>
          )}
        </Row>
        <Paginations
          pageCount={Math.ceil(order.totalCount/order.limit)}
          page={order.page}
          changePage={p=>order.setPage(p)}
        />
        <MyOrderModal show={ui.myOrderModalVisible} onHide={()=>{
          ui.setMyOrderModalVisible(false);
        }}/>
    </Container>
  )
});

export default MyOrders;