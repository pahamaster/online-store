import React, {useContext, useState, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {ListGroup, Container} from 'react-bootstrap';
import {fetchReviewsByUserIdAndDeviceId} from '../http/deviceApi';
import {useHistory} from 'react-router-dom';
import {REVIEW_ROUTE} from '../utils/consts';
import Paginations from '../components/Paginations';
import {Context} from '../index';

const Reviews=observer(({deviceId})=>{
  const {review}=useContext(Context);
  const history=useHistory();
  const [reviews, setReviews]=useState([]); 

  useEffect(()=>{
    fetchReviewsByUserIdAndDeviceId({deviceId, page: review.page, limit: review.limit}).then(data=>{
      setReviews(data.rows);
      review.setTotalCount(data.count);
    }).catch(e=>alert(e.response.data.message));
  }, [review.fUpdate, review.page]);

  // const linkToReview=(userId, deviceId)=>{

  // }

  return (
    <Container>
      <ListGroup className='mt-2' style={{overflow: 'auto', maxHeight: '400px'}}>
        {reviews.map(item=>
          <ListGroup.Item
            style={{cursor: 'pointer'}}
            key={item.id}
            id={item.id}
            onClick={e=>{
              //e.preventDefault();
              history.push(REVIEW_ROUTE+'?deviceId='+item.deviceId+'&userId='+item.userId);
            }
          }>
              <h5><b>{item.user.name}.</b> {item.title.substr(0, 50)}{item.title.length>50 && '...'}</h5>
              <div>{item.body.substr(0, 80)}{item.body.length>80 && '...'}</div>
          </ListGroup.Item>
        )}
      </ListGroup>
      <Paginations
        pageCount={Math.ceil(review.totalCount/review.limit)}
        page={review.page}
        changePage={p=>review.setPage(p)}
      />
    </Container>
    
  );
});

export default Reviews;