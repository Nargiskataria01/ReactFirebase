import { useEffect, useState } from "react"
import DatePicker from "react-multi-date-picker";
import { logout } from "./firebase";
import { Link } from 'react-router-dom';

export default function Calender(props) {
  const today = new Date()
  const tomorrow = new Date()
  const [values, setValues] = useState([today, tomorrow])


  useEffect(() => {
    console.log("asdgsdgsd",values);
    props.setDate(values)
  }, [])
  
  const onchangeValues = (v)=>{
    setValues(v);
    props.setDate(v)
  }

  return (
    < div className="card1" >
      <Link to="/Dashboard" >
        <button style={{
          marginLeft: '94%', fontSize: '20px', marginTop: '5px',
          backgroundColor: 'black', color: 'white', borderColor: "black"
        }} > Back</button>
      </Link>
      <div className="date" style={{ paddingTop: '50px', marginLeft: "35%" }}>
        <DatePicker
          multiple
          value={values}
          onChange={()=>onchangeValues()}
        />
      </div>
    </div>
  )
}