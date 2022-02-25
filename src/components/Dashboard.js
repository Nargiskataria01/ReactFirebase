import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Dashboard.css";
import { auth, db } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import StopWatch from './StopWatch';
import Dashboard1 from './Dashboard1';
import { Avatar } from "@material-ui/core";
import TimerIcon from '@material-ui/icons/Timer';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const [onlinevalue, setOnlinevalue] = useState("");
  const [status, setStatus] = useState("Available");
  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
      localStorage.setItem('users', JSON.stringify(user));
      sessionStorage.setItem('users', JSON.stringify(user));
      return ({ user })
    } catch (err) {
      console.error(err);
    }
  };

  const setInputValue = (value) => {
    setOnlinevalue(value)
  }
  useEffect(() => {
    if (loading) return;
    fetchUserName();
  }, [user, loading]);

  useEffect(() => {
    const selected = document.querySelector('.status');
    selected.addEventListener('change', (e) => {
      console.log(",dsbhjfbdsg", e.target.value);
      setStatus(e.target.value)
    })
  }, []);
  console.log(user);

  return (
    <div style={{ flexDirection: "row", display: "flex" }}>
      <div style={{ background: 'black', color: 'white', width: "20%", height: '100vh' }}>
        <div style={{ display: 'flex', marginLeft: ' 30px', alignItems: "center", marginTop: 50 }}>
          <Avatar>{name.substring(0, 1).toUpperCase()}</Avatar>
          <div style={{ marginLeft: '10px', marginTop: '10px' }}>
            {name}
            <div>
              <select name="status" className="status">
                <option value="Available" > Available</option>
                <option value="Away" > Away</option>
                <option value="Busy" > Busy</option>
              </select>
              <Link to="/Dashboard2" >
                <TimerIcon  style={{fontSize:'xx-large', marginLeft:'82%', marginTop:'-37%', marginBottom:'8%', color:'sandybrown'}} />
              </Link>
            </div>
          </div>
          <div style={{
            height: 10, width: 10, borderRadius: 10,
            background: "green",
            position: "absolute", left: 60, top: 80
          }} />
        </div>
        <StopWatch user={user} setInputValue={(e) => setInputValue(e)} status={status} />
        <div className="dashboard__container" style={{ marginTop: '40px' }}>
          Logged in as
          <div style={{ marginTop: '15px' }}>{name}</div>
          <div >{user?.email}</div>
        </div>
      </div>
      <div className="dash1" style={{ width: "80%", height: "100vh",backgroundSize:"cover", backgroundImage: 'url("https://img.freepik.com/free-photo/flat-lay-desk-arrangement-with-copy-space_23-2148928165.jpg?size=626&ext=jpg")', }}>
        < Dashboard1 onlinevalue={onlinevalue} />
      </div>
    </div>
  );
}
export default Dashboard;




