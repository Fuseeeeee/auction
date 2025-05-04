import React,{useState, useEffect } from 'react'
import {Typography } from '@mui/material';


 const  Timer = (props) => {
    
    const [ time, setTime] = useState("");
    const [colur,setcolur]= useState("orange");
    let maxTime = 0;    
    var timer;
    const timeChange = () => {
        maxTime--;
        if(maxTime< 10){
            setcolur("red");
        }
        if(maxTime<=0 ){
            setTime("Auction Finished")
            clearInterval(timer);
            if(props.onTimeEnd){
                props.onTimeEnd();
            }
        }else{
            setTime(maxTime);
        }
  };

  

  

    useEffect(()=>{
        maxTime = props.maxTime ? props.maxTime : time;
            
                
           
         timer = setInterval(timeChange,1000);    
       },[])
  
  return (
        <Typography
                    variant='h5'
                    sx={{
                        float:'right',
                        color:`${colur}`
                    }}
                        >
                      {time === "Auction Finished" ? time : `TIME LEFT: ${time} sec`}
                    </Typography>
  )
}

export default Timer;