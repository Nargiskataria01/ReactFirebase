import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { auth, db } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import StopWatch from './StopWatch';
import Dashboard1 from './Dashboard1';
import { Avatar } from "@material-ui/core";
import TimerIcon from '@material-ui/icons/Timer';
import { Link } from 'react-router-dom';
import { getStatusColor } from "../utils/helper";
import Background from '../assests/desk.jpg';

function Dashboard() {
  const [user, setUser] = useState(null)
  const [name, setName] = useState("");
  const [onlinevalue, setOnlinevalue] = useState("");
  const [status, setStatus] = useState("Available");
  const fetchUserName = async (user) => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
      return ({ user })
    } catch (err) {
      console.error(err);
    }
  };
  const setInputValue = (value) => {
    setOnlinevalue(value)
  }

  const setUserDeatils = async()=>{
    const usr = await localStorage.getItem('user');
    console.log("asfsfis",usr);
    setUser(JSON.parse(usr));
    await fetchUserName(JSON.parse(usr))
  }
  useEffect(() => {
    setUserDeatils();
    return () => null
  }, []);

  useEffect(() => {
    const selected = document.querySelector('.status');
    selected.addEventListener('change', (e) => {
      console.log(",dsbhjfbdsg", e.target.value);
      setStatus(e.target.value)
    })
    return () => {
      selected.removeEventListener('change', (e) => {
        console.log(",dsbhjfbdsg", e.target.value);
        setStatus(e.target.value)
      })
    }
  }, []);
  

  return (
    <div style={{ flexDirection: "row", display: "flex" }}>
      <div style={{ background: 'black', color: 'sandybrown', width: "20%", height: '150vh' }}>
        <div style={{ display: 'flex', marginLeft: '30px', alignItems: "center", marginTop: 50 }}>
          <Avatar style={{color:'black'}}>{name.substring(0, 1).toUpperCase()}</Avatar>

          <div style={{ marginLeft: '10px', marginTop: '10px' }}>
            {name}
            <div>

              <select name="status" className="status"  style={{backgroundColor:"black", color:"sandybrown", borderColor:"black"}}>
                <option value="Available" > Available</option>
                <option value="Away" > Away</option>
                <option value="Busy" > Busy</option>
              </select>
            </div>
          </div>

          <div style={{
            height: 10, width: 10, borderRadius: 10,
            background: getStatusColor(status),
            position: "absolute", left: 60, top: 80
          }} />
          <Link to="/Dashboard2" >
          <TimerIcon  style={{fontSize:'xx-large', marginLeft:'85%',  color:'sandybrown'}} />
              </Link>
        </div>

      {user&&  <StopWatch user={user} setInputValue={(e) => setInputValue(e)} status={status} />}

        {/* <div className="dashboard__container" style={{ marginTop: '40px' }}>
          Logged in as
          <div style={{ marginTop: '15px' }}>{name}</div>
          <div >{user?.email}</div>
        </div> */}
      </div>
      <div style={{ width: "80%", height: "150vh", backgroundSize: 'cover', backgroundImage: 'url(' + Background + ')'}}>
        
        <Dashboard1 onlinevalue={onlinevalue} />
      </div>
    </div>
  );
}
export default Dashboard;



