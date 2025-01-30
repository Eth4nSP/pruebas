import { useEffect } from 'react';
import Loading from '../../../components/loading/loading';
import { useNavigate } from 'react-router-dom';
function RedirigirHome() {
  const navigate =useNavigate()
  useEffect(()=>{
    navigate("/homeEstu");
  },[])
  return (
        <Loading></Loading>
  );
}

export default RedirigirHome;