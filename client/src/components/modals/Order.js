import React, {useState, useEffect, useContext} from 'react';
import {Modal, Row, Col, Button, Tab, Tabs, Dropdown} from 'react-bootstrap';
import {Context} from '../../index';
import {useHistory} from 'react-router-dom';
import {DEVICE_ROUTE} from '../../utils/consts';
import {observer} from 'mobx-react-lite';
import {fetchAdminOrders} from '../../http/deviceApi';
import {fetchOrderStatusName, updateOrderStatus} from '../../http/deviceApi';
import {formatDate, formatRub} from '../../utils/utils';

const OrderModal=observer(({show, onHide})=>{
  const {order, ui, user}=useContext(Context);
  const [statuses, setStatuses]=useState([]);
  const [selectedStatus, setSelectedStatus]=useState(null);
  const history=useHistory();

  useEffect(()=>{
    if (!ui.keyOrderTab) ui.setKeyOrderTab('devices');
  }, []);

  useEffect(()=>{
    if (order.orderId)
      fetchAdminOrders({orderId: order.orderId}).then(data=>{
        console.log(data);
        order.setOrder(data);
        return fetchOrderStatusName();
      }).then(data=>{
        setStatuses(data);
        //console.log(data);
      })
      .catch(e=>alert(e.response.data.message));
  }, [order.orderId, order.fUpdate]);

  const addStatus=()=>{
    if (selectedStatus)
      updateOrderStatus({orderId: order.order.id, statusId: selectedStatus.id})
      .then(()=>{
        order.setFUpdate();
        setSelectedStatus(null);
      })
      .catch(e=>alert(e.response.data.message));
  }

  const toAdmin=()=>{
    updateOrderStatus({orderId: order.order.id, admin: '1'})
    .then (()=>{
      order.setFUpdate();
    }).catch(e=>alert(e.response.data.message));
  }
  
  return (
    <Modal 
      show={show}
      onHide={onHide}
      size='lg'
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Заказ #{order?.order?.id}. Статус: {order?.order?.status?.namerus}. Adm: {order?.order?.admin?.email}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs 
          id="myOrderTab"
          activeKey={ui.keyOrderTab}
          onSelect={k=>ui.setKeyOrderTab(k)}
          className="mt-3"
        >
          <Tab eventKey="devices" title="Товары">
            {order?.order?.order_devices?.map((device, i)=>
              <Row 
                className='p-2 d-flex align-items-center rowhover'
                onClick={e=>{
                  if (e.target.nodeName==='DIV') history.push(DEVICE_ROUTE+'/'+device.deviceId)
                }}
              >
                <Col>{device.device.brand.name+' '+device.device.name}</Col>
                <Col>{formatRub(device.price)}</Col>
                <Col>{device.count+' шт.'}</Col>
              </Row>
            )}
          </Tab>
          <Tab eventKey="statuses" title="Статус">
            {order?.order?.order_statuses?.map(status=>
              <Row
                className='p-2 d-flex align-items-center'
              >
                <Col>{status?.status?.namerus}</Col>
                <Col>{formatDate(status?.createdAt)}</Col>
              </Row>
            )}
            {(order?.order?.admin?.email===user?.user?.email) && (!order?.order?.status?.finished) ?
              <Row>
                <Col>
                  <Dropdown>
                    <Dropdown.Toggle>{selectedStatus?.namerus || 'Выберите статус'}</Dropdown.Toggle>
                    <Dropdown.Menu style={{overflow: 'auto', maxHeight: '400px'}}>
                      {statuses.map(status=>
                        <Dropdown.Item 
                          onClick={()=>setSelectedStatus(status)} 
                          key={status.id}>
                            {status.namerus}
                        </Dropdown.Item>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
                <Col>
                  <Button onClick={addStatus}>Добавить статус</Button>
                </Col>
              </Row>
            : null}
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer style={{justifyContent: 'space-between'}}>
        <Modal.Title>
          Пользователь: {order?.order?.user?.email}. Сумма: {formatRub(order.orderTotalPrice())}
        </Modal.Title>
        {order?.order?.adminId ? null : <Button variant='outline-danger' onClick={toAdmin}>Сопровождать</Button>}
        <Button variant='outline-danger' onClick={onHide}>Закрыть</Button>
      </Modal.Footer>
  </Modal>
  )
});

export default OrderModal;