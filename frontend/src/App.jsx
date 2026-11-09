import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />
        
        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        ></Route>
      </Routes>


    </BrowserRouter>

  );
}

export default App;