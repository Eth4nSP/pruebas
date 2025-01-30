/* eslint-disable react/prop-types */
import { Fragment } from 'react';
import ButtonBackAndTitle from '../buttonBackAndTitle/buttonBackAndTitle.jsx';
import Header from './Header/header.jsx';
import Footer from './Footer/footer.jsx';
import Loading from '../loading/loading.jsx';
import Error from '../error/error.jsx';
function BaseUI({ children, titulo, ocultarAtras, confirmarAtras, dirBack, loading, error }) {
  return (
    <Fragment>
      <Header />
      <div className='box'>
        <div className='container'>
          <ButtonBackAndTitle
            titulo={titulo}
            ocultarAtras={ocultarAtras}
            confirmarAtras={confirmarAtras}
            dirBack={dirBack}
          />
          <div className='pageBorder'>
            <div className='pageBorder_interior'>
            {error.error ? (
              <Error errorMessage={error.errorMessage} errorDetails={error.errorDetails}/>
            ) : (
              loading ? <Loading /> : children
            )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Fragment>
  );
}

export default BaseUI;
