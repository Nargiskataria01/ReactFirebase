import React, { useState, useEffect } from 'react';
import { logout } from "./firebase";
import { Avatar } from "@material-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

export default function Dashboard1(props) {
  const { onlinevalue } = props;
  const [name, setName] = useState("");
  const [onlineState, setOnlineState] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUserName = async (user) => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
      setOnlineState(data?.onlineState);
      return ({ user })

    } catch (err) {
      console.error(err);
    }
  };
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
  const logoutButton = ()=>{
    logout().then(e=>{
window.location.href='/login';
    }).catch(err=>console.log("error on logout click"))
  }

  return (
    <div className='dash2' >
      <button className="dashboard__btn" onClick={logoutButton} style={{ marginLeft: '86%' }}>
        Logout
      </button>
      <div style={{ display: 'flex', marginLeft: '30px', alignItems: "center", marginTop: '50' }}>
        <h2 style={{ marginLeft: '40%', marginBottom: '40px' }}> Desk Area</h2>
        <Avatar style={{ marginLeft: '1%', color:'black' }}>{name.substring(0, 1).toUpperCase()}</Avatar>
        <div style={{ marginLeft: '10px' }}>
          <div className='val' style={{ marginBottom: '30px' }}>   
        <input placeholder='Online' value={onlinevalue||onlineState } style={{ fontSize: '20px', width: '60%', border: '0px', backgroundColor:'transparent' }}/> 
          {/* {onlinevalue}  */}
          </div>
        </div>
      </div>
    </div>
  );
}