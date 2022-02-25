import React, { useState, useEffect } from 'react';
import { logout } from "./firebase";
import { Avatar } from "@material-ui/core";
import Dashboard2 from './Dashboard2';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";

export default function Dashboard1(props) {
  const { onlinevalue } = props;
  const [name, setName] = useState("");
  const [user, loading] = useAuthState(auth);
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
  useEffect(() => {
    if (loading) return;
    fetchUserName();
  }, [user, loading]);

  return (
    <div className='dash2' >
      <button className="dashboard__btn" onClick={logout} style={{ marginLeft: '86%' }}>
        Logout
      </button>
      <div style={{ display: 'flex', marginLeft: '30px', alignItems: "center", marginTop: 50 }}>
        <h2 style={{ marginLeft: '40%', marginBottom: '40px' }}> Desk Area</h2>
        <Avatar style={{ marginLeft: '1%' }}>{name.substring(0, 1).toUpperCase()}</Avatar>
        <div style={{ marginLeft: '10px' }}>
          <div className='val' style={{ marginBottom: '30px' }}>
            {onlinevalue}
          </div>
        </div>
      </div>
    </div>
  );
}