
import React, { useState, useRef, useEffect } from "react";
import { collection, doc, getDoc, getDocs, query, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";
import { db } from "./firebase";
import {
	Box, Typography, IconButton, Grid, makeStyles, Table,
	TableHead, TableRow, TableCell, TableContainer, TableBody, Paper, Tooltip
} from "@material-ui/core";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import PauseCircleFilledIcon from "@material-ui/icons/PauseCircleFilled";

const useStyle = makeStyles((theme) => ({
	root: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center"
	},
	labelTime: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-around"
	},
	tableContainer: {
		maxHeight: "70vh"
	},
	table: {
		minWidth: 600
	},
	tableBody: {
		alignItems: "space-around",
		overflowY: "auto"
	},
	lapCell: {
		display: "flex",
		flexDirection: "row"
	},
	lapCellTypo: {
		marginRight: 20
	}
}));

const lapsDefault = {
	lapsList: [],
	lastLapTime: 0,
	fastest: {
		lapTime: Infinity,
		index: -1
	},
	slowest: {
		lapTime: -1,
		index: -1
	}
};

const Stopwatch = (props) => {
	const [time, setTime] = useState(0.0);
	const [isActive, setIsActive] = useState(false);
	const [laps, setLaps] = useState(lapsDefault);
	const intervalRef = useRef(0);
	const [startTime, setStartTime] = useState(null);

	const updateUserDoc = (newValue) => {
		setTimeout(async () => {
			const docRef = query(collection(db, "users"), where("uid", "==", props?.user?.uid));
			const docSnap = await getDocs(docRef);
			const data = docSnap.docs[0].data();
			if (data) {
				const docRef1 = doc(db, "users", docSnap.docs[0].id);
				const docSnap1 = await getDoc(docRef1);
				if (docSnap1.exists()) {
					await updateDoc(docRef1, {
						onlineState: newValue
					});
				}
			}
		}, 2000);
	}
	const onChange = async (event) => {
		const newValue = event.target.value;
		localStorage.setItem("person", newValue)
		props.setInputValue(newValue)
		updateUserDoc(newValue)
	};


	const formatTime = () => {
		const sec = `${Math.floor(time) % 60}`.padStart(2, "0");
		const min = `${Math.floor(time / 60) % 60}`.padStart(2, "0");
		const hour = `${Math.floor(time / 3600)}`.padStart(2, "0");
		return (
			<>
				<Typography variant="h1" style={{ fontSize: '35px'}}>{[hour, min, sec].join(":")}</Typography>
				<Box className={classes.labelTime}>
					{["hr", "min", "sec"].map((unit) => (
						<Typography key={unit} vairant="overline">
							{unit}
						</Typography>
					))}
				</Box>
			</>
		);
	};

	const docRef = doc(db, "data", props.user.uid);
	const handelPlayPause = async () => {
		setIsActive(!isActive);
		console.log("nd,zjcbxdbmvx", isActive)
		if (isActive) {

			const docRef = doc(db, "data", props.user.uid);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				const newdata = docSnap.data().timeLogs;
				newdata.push({ startTime: startTime, endTime: new Date(), status: props?.status })
				await updateDoc(docRef, {
					timeLogs: newdata
				});

			} else {
				const docData = {
					updateTime: Timestamp.fromDate(new Date()),
					timeLogs: [{ startTime: startTime, endTime: new Date(), status: props?.status }],
				};
				setDoc(doc(db, "data", props?.user?.uid), docData);
			}
			setStartTime(null);
		}
		else {
			setStartTime(new Date())
		}
	};

	const handelReset = () => {
		setTime(0);
		setIsActive(false);
		setLaps(lapsDefault);
	};
	const handelLaps = () => {
		const lapTime = time - laps.lastLapTime;
		const thisLap = {
			lapIndex: laps.lapsList.length,
			lapTime: lapTime,
			totalTime: time
		};
		const newSlowest = { ...laps.slowest };
		if (thisLap.lapTime > laps.slowest.lapTime) {
			newSlowest.lapTime = thisLap.lapTime;
			newSlowest.index = laps.lapsList.length;
		}
		const newFastest = { ...laps.fastest };
		if (thisLap.lapTime < laps.fastest.lapTime) {
			newFastest.lapTime = thisLap.lapTime;
			newFastest.index = laps.lapsList.length;
		}
		const newLaps = {
			lapsList: [...laps.lapsList, thisLap],
			lastLapTime: Math.floor(time),
			slowest: newSlowest,
			fastest: newFastest
		};
		setLaps(newLaps);
	};
	useEffect(() => {
		console.log("ashagsdfasghdfghasdghas");
		if (isActive) {
			intervalRef.current = setTimeout(() => {
				const t = time + 0.1
				setTime(t)
				localStorage.setItem("pausedtime", t)
			}, 100);
			return () => clearTimeout(intervalRef.current);
		}
	}, [time, isActive]);

	useEffect(() => {
		const pausedtime = localStorage.getItem("pausedtime")
		const pausedtimeParsed = JSON.parse(pausedtime)
		setTime(pausedtimeParsed)
		return () => null
	}, []);

	const classes = useStyle();

	return (
		<div style={{ marginTop: '10%', }}>

			<Grid m={2} className={classes.root}   >

				<Grid item> {formatTime()}  </Grid>

				<Grid item  >
					<ControlButtons
						args={{
							time,
							isActive,
							classes,
							handelPlayPause,
							handelLaps,
							handelReset
						}}
					/>
				</Grid>

				<Grid item style={{ color: 'aquamarine' }}>
					{laps.lapsList.length > 0 && <Laps laps={laps} />}
				</Grid>

			</Grid>

			<div style={{ marginTop: '35px', marginLeft: '75px' }}>

				<input placeholder="Online Log" onChange={onChange} style={{ fontSize: '20px', width: '60%', marginTop: "30px", backgroundColor: 'black', color: 'white', border: '0px' }} />
			</div>

		</div>
	);
};

const ControlButtons = ({
	args: { time, isActive, handelPlayPause, handelLaps, handelReset, classes }
}) => {

	return (
		< div style={{ display: 'flex', }}>

			{/* play or pause stopwatch */}
			<Tooltip title={isActive ? "Pause" : "Play"} >
				<IconButton onClick={() => handelPlayPause()} >
					{
						{
							true: <PauseCircleFilledIcon className={classes.pauseButton} />,
							false: <PlayCircleFilledIcon className={classes.playButton} />
						}[isActive]
					}
				</IconButton>
			</Tooltip>

		</ div>
	);
};

const Laps = ({ laps }) => {
	const classes = useStyle();
	const columns = [
		{ id: "lapIndex", label: "Laps" },
		{ id: "lapTime", label: "Time" },
		{ id: "totalTime", label: "Total" }
	];
	const formatTime = (time) => {
		const sec = `${Math.floor(time)}`.padStart(2, "0");
		const min = `${Math.floor(time / 60) % 60}`.padStart(2, "0");
		const hour = `${Math.floor(time / 3600)}`.padStart(2, "0");
		return (
			<Typography variant="body1">{[hour, min, sec].join(" : ")}</Typography>
		);
	};
	const formattedRow = (lap, index) => {
		return (

			<TableRow hover="true" key={index}>
				<TableCell className={classes.lapCell}>
					<Typography className={classes.lapCellTypo}>
						{lap.lapIndex}
					</Typography>
					{laps.lapsList.length > 1 && laps.slowest.index === lap.lapIndex && (
						<Typography>Slowest</Typography>
					)}
					{laps.lapsList.length > 1 && laps.fastest.index === lap.lapIndex && (
						<Typography>Fastest</Typography>
					)}
				</TableCell>
				<TableCell>{formatTime(lap.lapTime)}</TableCell>
				<TableCell>{formatTime(lap.totalTime)}</TableCell>
			</TableRow>
		);
	};
	return (
		<>
			<TableContainer component={Paper} className={classes.tableContainer}>
				<Table className={classes.table} stickyHeader>
					<colgroup>
						{columns.map((column) => (
							<col style={{ minWidth: "100px" }} />
						))}
					</colgroup>
					<TableHead>
						<TableRow className={classes.tableRow}>
							{columns.map((column) => (
								<TableCell key={column.id}>{column.label}</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody className={classes.tableBody}>
						{laps.lapsList
							.slice()
							.reverse()
							.map((lap, index) => formattedRow(lap, index))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
};
export default Stopwatch;