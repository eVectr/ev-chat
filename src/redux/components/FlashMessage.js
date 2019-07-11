import React, {Component} from 'react';
import FlashMessage from 'react-flash-message'



 class Sucess extends Component {

    render(){
        let sucess={
            position: 'absolute',
            top:'10%',
            left: '50%',
            color:'#008000',
            fontSize:'16px'
    }
       
        return(
        <FlashMessage  duration={2000} >
            <p style={sucess}>Login Sucessfully</p>
        </FlashMessage>
       
    )    
    }
}
export default Sucess
