import React, {useContext, useEffect, useState} from 'react';
import {Container, Row, Col, Spinner, Form, Button} from 'react-bootstrap';
import TypeBar from '../components/TypeBar';
import BrandBar from '../components/BrandBar';
import DeviceList from '../components/DeviceList';
import {observer} from 'mobx-react-lite';
import {Context} from '../index';
import {fetchTypes, fetchBrands, fetchDevices, fetchBasketDevices, fetchOneDevice} from '../http/deviceApi';
import Paginations from '../components/Paginations';
import {getLocalBasketDevices} from '../utils/utils';
import useFetching from '../hooks/useFetching';

const Shop=observer(()=>{
  const [timerId, setTimerId]=useState(null);
  const {device, user, basket}=useContext(Context);
  let t;
  const [fetchTypesBrands, isLoadingTypesBrands]=useFetching(()=>{
    fetchTypes().then(data=>{
      //console.log('fetchtypesbrands');
      device.setTypes(data);
      device.setSelectedType(data.find(i=>i.id===device.selectedType?.id));
      t=data.filter(type=>type?.brands?.length);
      return fetchBrands();
    }).then(data=>{
      device.setBrands(data);
      device.setSelectedBrand(data.find(i=>i.id===device.selectedBrand?.id));
      const b=data.filter(brand=>brand.types?.length);
      device.setBarTypes(device.selectedBrand ? device.selectedBrand.types : t);
      device.setBarBrands(device.selectedType ? device.selectedType.brands : b);
    });
  });

  const [searchingFetch, isLoading]=useFetching(async ()=>{
    fetchDevices(device?.selectedType?.id, 
      device?.selectedBrand?.id, 
      device.page, device.limit, 
      device.searchValue,
      device.instock
    ).then(data=>{
      device.setDevices(data.rows);
      device.setTotalCount(data.count);
    });
  });

  useEffect(async ()=>{  //1
    if (user.isAuth) fetchBasketDevices(user.id).then(data=>{
      //basket.setBasketDevices(data.rows);
      basket.setCount(data.count);
    }); 
    else {
      let bDevices=getLocalBasketDevices();
      basket.setCount(bDevices?.length || 0);
    }
  },[]);

  useEffect(async ()=>{  //2
    await fetchTypesBrands();
    await searchingFetch();
  }, [device.page, device.selectedType?.id, device.selectedBrand?.id, device.instock, device.fUpdate]);

  // useEffect(()=>{ //4
  //   searchingFetch();
  // }, [device.page, device.selectedType, device.selectedBrand]);

  useEffect(()=>{ //3
    if (timerId) clearTimeout(timerId);
    setTimerId(setTimeout(searchingFetch, 600));
  }, [device.searchValue]);

  return (
    <Container>
      <Row className='mt-2'>
        <Col md={3}>
          <TypeBar />
        </Col>
        <Col md={9}>
          <BrandBar />
          <Row className='d-flex align-items-center flex-nowrap'>
            <Form.Control
              style={{width: '80%'}}
              className='mt-2 mb-2'
              placeHolder='Поиск'
              value={device.searchValue}
              onChange={e=>{
                device.setPage(1);
                device.setSearchValue(e.target.value);
              }}
            />
            <label>
              <input style={{marginRight: 5}} type='checkbox' checked={device.instock} onChange={()=>device.setInstock()} />
              В наличии
            </label>
            
          </Row>
          {isLoading ? <Spinner animation='grow'/> : <DeviceList />}
          <Paginations 
            pageCount={Math.ceil(device.totalCount/device.limit)}
            page={device.page}
            changePage={p=>device.setPage(p)}
          />
        </Col>
      </Row>
    </Container>
  )
});

export default Shop;