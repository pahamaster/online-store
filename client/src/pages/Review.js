import React, {useState, useEffect} from 'react';
//import {observer} from 'mobx-react-lite';
//import {Context} from '../index';
import {Card} from 'react-bootstrap';
import {fetchReviewsByUserIdAndDeviceId} from '../http/deviceApi';
import {useLocation} from 'react-router-dom';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}


const ReviewPage=(()=>{
  let query=useQuery();
  const [review, setReview]=useState(null);

  const userId=query.get('userId');
  const deviceId=query.get('deviceId');
  
  useEffect(()=>{
    fetchReviewsByUserIdAndDeviceId({userId, deviceId}).then(data=>{
      //console.log(data);
      setReview(data?.rows[0]);
    }).catch(e=>alert(e.response.data.message));
  }, []);
  
  return (
    <div>
      {review && (
        <div>
          <h3 style={{textAlign: 'center', marginTop:10}}>{review.device.brand.name} {review.device.name}. Отзыв.</h3>
          <Card style={{margin: '20px 20px', padding: '5px 5px'}}>
            <Card.Title><b>{review.user.name}</b></Card.Title>
            <Card.Subtitle><b>{review.title}</b></Card.Subtitle>
            <Card.Text className='mt-1'>{review.body}</Card.Text>
          </Card>
        </div>
      )}
    </div>
  );
});

export default ReviewPage;