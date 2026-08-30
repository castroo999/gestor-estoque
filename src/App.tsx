import "./App.css";
import { BrowserRouter, Routes, Route,  Navigate} from "react-router-dom";

import Login from "./pages/Login";
import Cadastrar from "./pages/Cadastro";
import Home from "./pages/Home";
import AddProduto from './pages/AddProduto'
import EditarProduto from './pages/EditarProduto'
import Dashboard from './components/Dashboard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastrar" element={<Cadastrar />} />
        <Route path="/home" element={<Home />} />
        <Route path="/add-produtos" element={<AddProduto />} />
        <Route path="/editar-produto/:id" element={<EditarProduto />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}