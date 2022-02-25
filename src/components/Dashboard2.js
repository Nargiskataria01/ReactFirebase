import React from 'react'
import Calender from './Calender';
import Cardss from './Cardss';


const Dashboard2 = () => {
    return (
        <div style={{ width: "100%", height: "100%",backgroundSize:'cover', backgroundImage: 'url("https://img.freepik.com/free-photo/flat-lay-desk-arrangement-with-copy-space_23-2148928165.jpg?size=626&ext=jpg")', }}>
            <Calender />
            <Cardss />
        </div>
    )
}

export default Dashboard2;