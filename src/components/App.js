// import React from 'react';
// import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
// import Login from "./Login";
// import Register from "./Register";
// import Reset from "./Reset";
// import Dashboard from "./Dashboard";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth } from "./firebase";
// import Dashboard2 from "./Dashboard2"

// function App() {
//   const [user] = useAuthState(auth);
//   console.log(user);
//   return (
//     <div className="app">
//       <Router>
//         <Routes>
//           <Route path="/" element={user?.accessToken ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
//           <Route exact path="/reset" element={!user?.accessToken ? <Reset /> : <Navigate to="/dashboard" />} />
//           <Route exact path="/dashboard" element={user?.accessToken ? <Dashboard /> : <Navigate to="/login" />} />
//           <Route exact path="/login" element={user?.accessToken ? <Navigate to="/dashboard" /> : <Login />} />
//           <Route exact path="/register" element={<Register />} />
//           <Route exact path="/dashboard2" element={<Dashboard2 />} />
//         </Routes>
//       </Router>
//     </div>
//   );
// }
// export default App;  
 
import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Reset from "./Reset";
import Dashboard from "./Dashboard";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import Dashboard2 from "./Dashboard2"
import {privateRoutes,publicRoutes} from './Routing/routes';
import PrivateRoute from './Routing/ProtectedRoutes';

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
        {/* <Route exact path="/" element={user?.accessToken ? <Dashboard/> : <Login />} /> */}
        {/* <Route exact path="/dashboard" element={user?.accessToken ? <Dashboard /> : <Navigate to="/login" />} /> */}
        <Route
        exact
        path="/"
        element={localStorage.getItem('isAuth') ? (
            <Navigate to="/dashboard" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/login"
        exact
        element={
          localStorage.getItem('isAuth') ? <Navigate to="/dashboard" /> : <Login />
        }
      />
        <Route
        path="/register"
        exact
        element={
          localStorage.getItem('isAuth') ? <Navigate to="/dashboard" /> : <Register />
        }
      />
       <Route
        path="/reset"
        exact
        element={
          localStorage.getItem('isAuth')? <Navigate to="/dashboard" /> : <Reset />
        }
      />
          <Route
          exact
        path='/dashboard'
          element={
            <PrivateRoute>
              <Dashboard/>
            </PrivateRoute>
          }
        />
          <Route
          exact
        path='/dashboard2'
          element={
            <PrivateRoute>
              <Dashboard2/>
            </PrivateRoute>
          }
        />
      {/* <Route
        path="*"
        render={() => (
          <BrockenLink
            status="404"
            reason={appMessages.wrongPage}
            reasonDetails={appMessages.tryAgain}
            buttonTitle={
              localStorage.getItem('isAuth') ? appConstants.home : appConstants.login
            }
            goto="/"
          />
        )}
      /> */}
          {/* <Route path="/" element={user?.accessToken ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route exact path="/reset" element={!user?.accessToken ? <Reset /> : <Navigate to="/dashboard" />} />
          <Route exact path="/dashboard" element={user?.accessToken ? <Dashboard /> : <Navigate to="/login" />} />
          <Route exact path="/login" element={user?.accessToken ? <Navigate to="/dashboard" /> : <Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/dashboard2" element={<Dashboard2 />} /> */}
        </Routes>
      </Router>
    </div>
  );
}
export default App;   