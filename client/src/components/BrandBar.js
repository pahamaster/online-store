import React, {useContext} from 'react';
import {observer} from 'mobx-react-lite';
import {Context} from '../index';
import {Card, Row} from 'react-bootstrap';

const BrandBar=observer(()=>{
  const {device}=useContext(Context);
  return (
    <Row className='d-flex'>
      {device?.barBrands?.map(brand=>
        <Card 
          style={{width: 'auto', cursor: 'pointer'}} className='p-2'
          onClick={()=>device.setSelectedBrand(device?.selectedBrand?.id===brand.id ? (null, 1) 
            : (device?.brands?.find(i=>brand.id===i.id)), 1)}
          border={brand.id===device.selectedBrand?.id ? 'danger' : 'light'}
        >
          {brand.name}
        </Card>
      )}
    </Row>
  );
});

export default BrandBar;
