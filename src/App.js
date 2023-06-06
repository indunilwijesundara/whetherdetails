import { BrowserRouter, Route,Routes } from "react-router-dom";
import Login from "./Login/Login";
import Dashboard from "./Dashboard/Dashboard";

function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route exact path="/" element={<Login/>}></Route>
    <Route exact path="/dashboard" element={<Dashboard></Dashboard>}></Route>
       </Routes>
    </BrowserRouter>
  );
}

export default App;
