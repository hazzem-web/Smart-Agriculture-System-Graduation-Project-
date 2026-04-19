import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DetectPage from "./pages/DetectPage";
import IrrigationPage from "./pages/IrrigationPage";
import AboutPage from "./pages/AboutPage";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/detect" element={<DetectPage />} />
          <Route path="/irrigation" element={<IrrigationPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
