import styled from '@emotion/styled'
import Typography from '@mui/material/Typography';

function footer() {
  return (
    <FooterContainer >
        <div>
            <footer className='footer'>
                <div className='footer_links'>
                    <h6 className='links'>Politica de Privacidad</h6>
                    <h6 className='links'>Terminos y Condiciones</h6>
                    <h6 className='links'>Politicas de Cokiees</h6>
                    <h6 className='links'>Contactar</h6>
                </div>
                <div className='footer_name'>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <h5>WEB TIS</h5>
                    </Typography>
                </div>              
            </footer>
            <p>© 2024 CREATIVE HARBOR S.R.L. All rights reserved.</p>
        </div>        
    </FooterContainer>
  );
}

export default footer;


let FooterContainer = styled.footer`
    display: flex;
    color: white;
    background-color: #114093;
    margin-top: 1rem;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, 
              rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, 
              rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;
 
    .footer{
        display: flex;
        justify-content: space-between;
        margin-top: 2rem;
        margin-left: calc(0.6vw + 1rem);
        margin-right: 2rem;
        margin-bottom: 0;
        
    }
    .footer_links{
        margin: 0;
        padding: 0;
    }
    .footer_name{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .links{
        margin: 0;
    }
    p{
        width: 98vw;
        padding-bottom:0.5rem;
        text-align: center;
        font-size: calc(0.4vw + 0.3rem);
        display: block;
    }
`