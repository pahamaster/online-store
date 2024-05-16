import React, {useState, useEffect, useContext} from 'react';
import {Modal, Row, Col, Container, Button, Tab, Tabs} from 'react-bootstrap';
import {Context} from '../../index';
import {useHistory} from 'react-router-dom';
import {DEVICE_ROUTE} from '../../utils/consts';
import {observer} from 'mobx-react-lite';
import {fetchAuthOrders} from '../../http/deviceApi';
import {formatDate, formatRub} from '../../utils/utils';

const MyOrderModal=observer(({show, onHide})=>{
  const {order, ui}=useContext(Context);
  //const [myOrder, setMyOrder]=useState(null);
  const history=useHistory();

  useEffect(()=>{
    if (!ui.keyMyOrderTab) ui.setKeyMyOrderTab('devices');
  }, []);

  useEffect(()=>{
    if (order.orderId)
      fetchAuthOrders({orderId: order.orderId}).then(data=>{
        console.log(data);
        order.setOrder(data.rows[0]);
      }).catch(e=>alert(e.response.data.message));
  }, [order.orderId]);
  
  return (
    <Modal 
      show={show}
      onHide={onHide}
      size='lg'
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Заказ #{order.order?.id}. Статус: {order.order?.status?.namerus}.
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs 
          id="myOrderTab"
          activeKey={ui.keyMyOrderTab}
          onSelect={k=>ui.setKeyMyOrderTab(k)}
          className="mt-3"
        >
          <Tab eventKey="devices" title="Товары">
            {order.order?.order_devices?.map(device=>
              <Row 
                className='p-2 d-flex align-items-center rowhover'
                onClick={e=>{
                  if (e.target.nodeName==='DIV') history.push(DEVICE_ROUTE+'/'+device.deviceId)
                }}
              >
                <Col>{device.device.brand.name+' '+device.device.name}</Col>
                <Col>{formatRub(device.price)}</Col>
                <Col>{device.count}</Col>
              </Row>
            )}
          </Tab>
          <Tab eventKey="statuses" title="Статус">
            {order?.order?.order_statuses?.map(status=>
              <Row
                className='p-2 d-flex align-items-center'
              >
                <Col>{status.status.namerus}</Col>
                <Col>{formatDate(status.createdAt)}</Col>
              </Row>
            )}
          </Tab>
        </Tabs>
        
      </Modal.Body>
      <Modal.Footer style={{justifyContent: 'space-between'}}>
        <Modal.Title>
          Сумма заказа:{' '+formatRub(order.orderTotalPrice())}
        </Modal.Title>
        <Button variant='outline-danger' onClick={onHide}>Закрыть</Button>
      </Modal.Footer>
  </Modal>
  )
});

export default MyOrderModal;