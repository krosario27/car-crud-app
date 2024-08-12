import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import AddCar from "./components/AddCar";
import UpdateCar from "./components/UpdateCar";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddCar />} />
        <Route path="/update/:id" element={<UpdateCar />} />
      </Routes>
    </Router>
  )
}

export default App;
