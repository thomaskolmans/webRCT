import React, {Component} from 'react';
import { ScaleLoader } from 'react-spinners';
import { BACKGROUND_COLOR, BUSINESS_LOGO_PLACE, BUSINESS_LOGO } from "babel-dotenv";

export default class Loader extends Component {

    render() {
        return (
            <div className={"loading " + (this.props.loading ? 'active' : '')} style={{
                backgroundColor: "#" + BACKGROUND_COLOR
            }}>
                <ScaleLoader 
                    css={{position: 'absolute',top: '50%',left: '50%',transform: 'translate(-50%,-50%)' }} 
                    sizeUnit={"px"} 
                    size={150} 
                    color={'white'} l
                    oading={true} 
                />
                <div className={"logo " + BUSINESS_LOGO_PLACE}><img src={BUSINESS_LOGO} /></div>
            </div> 
        );
    }
}