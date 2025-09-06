import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeScreen from "./pages/HomeScreen";
import NotFound from "./components/NotFound";
import AboutScreen from "./pages/AboutScreen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />}/>
        <Route path="/about" element={<AboutScreen />}/>
        <Route path="*" element={<NotFound />}/>
      </Routes>
    </BrowserRouter>
  );
}
 
export default App;
