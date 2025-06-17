import {FormControlLabel, Switch} from '@mui/material';

export function VectorSwitch(){
    return(
        <FormControlLabel 
            control={<Switch defaultChecked />} 
            label="Vector Search"
            labelPlacement="bottom"
        />
    )
}