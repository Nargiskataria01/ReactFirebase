import React, { useEffect, useState } from 'react'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { auth, db } from "./firebase";
import { doc, getDoc,} from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';

const Cardss = () => {
    const [user, loading] = useAuthState(auth);
    const [time, setTime] = useState([])
    const getDocFromFirebase = async () => {
        const docRef = doc(db, "data", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const newdata = docSnap.data();
            console.log('newdata', newdata)
            setTime(newdata?.timeLogs)
        }
    }
    useEffect(() => {
        if (user.uid)
            getDocFromFirebase()
    }, [user])
    return (
        <div>
            <div className='cards' style={{ marginTop: '4%', display: 'flex', marginLeft: '20%', }}>
                <Card style={{ backgroundColor: "sandybrown" }}>
                    <CardContent  >
                        <Typography color="textSecondary" gutterBottom style={{ padding: '20px 0px 0px 0px', color: 'black' }}>
                            Online Hours
                        </Typography>
                    </CardContent>
                </Card>
                <Card style={{ marginLeft: '5%', backgroundColor: 'sandybrown' }}  >
                    <CardContent style={{}} >
                        <Typography color="textSecondary" gutterBottom style={{ padding: '24px 18px 12px 11px', color: 'black' }}>
                            Available
                        </Typography>
                    </CardContent>
                </Card>
                <Card style={{ marginLeft: '5%', backgroundColor: 'sandybrown' }}  >
                    <CardContent   >
                        <Typography color="textSecondary" gutterBottom style={{ padding: '24px 35px 12px 28px', color: 'black' }}>
                            Busy
                        </Typography>
                    </CardContent>
                </Card>
                <Card style={{ marginLeft: '5%', backgroundColor: 'sandybrown' }}  >
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom style={{ padding: '24px 35px 12px 28px', color: 'black' }}>
                            Away
                        </Typography>
                    </CardContent>
                </Card>
            </div>
            <div className='cardss' style={{ width: '70%', marginTop: '30px', marginLeft: '12%' }}>
                <Card >
                    <CardContent style={{ display: 'flex', backgroundColor: "sandybrown" }}>
                        <Typography color="textSecondary" gutterBottom style={{ marginLeft: '10%', color: 'black' }}>
                            Time
                        </Typography>
                        <Typography color="textSecondary" gutterBottom style={{ marginLeft: '58%', color: 'black' }}>
                            Status
                        </Typography>
                        <Typography color="textSecondary" gutterBottom style={{ marginLeft: '10%', color: 'black' }}>
                            Duration
                        </Typography>
                    </CardContent>
                    {time?.length > 0 &&
                        time?.map((i, x) => {
                            return (
                                <CardContent style={{ display: 'flex', backgroundColor: "black" }}>
                                    <Typography color="textSecondary" gutterBottom style={{ marginLeft: '5%', color: 'sandybrown', }}>
                                        {new Date(i?.startTime?.seconds * 1000).toUTCString()}-{new Date(i?.endTime?.seconds * 1000).toUTCString()}
                                    </Typography>
                                    <Typography color="textSecondary" gutterBottom style={{ marginLeft: '15%', color: 'sandybrown' }}>
                                        {i?.status}
                                    </Typography>
                                    <Typography color="textSecondary" gutterBottom style={{ marginLeft: '10%', color: 'sandybrown' }}>
                                        {new Date((i?.endTime?.seconds - i?.startTime?.seconds) * 1000).getSeconds()}
                                    </Typography>
                                </CardContent>
                            )
                        })
                    }
                    <CardContent style={{ backgroundColor: "black" }}>
                        <Typography color="textSecondary" gutterBottom style={{ marginLeft: '70%', color: "sandybrown" }}>
                            Total Hours
                        </Typography>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
export default Cardss;