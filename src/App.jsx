import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import './css/client.css';
import './css/admin.css';
import './css/popups.css';
import ClientPage from './components/ClientPage.jsx';
import Login from './components/Login.jsx';
import AdminPage from './components/AdminPage.jsx';
import Hall from './components/Hall.jsx';
import Payment from './components/Payment.jsx';
import Ticket from './components/Ticket.jsx';
import NotFound from './components/NotFound.jsx';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<ClientPage />} />
        <Route path="/:id" element={<ClientPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/hall/:id" element={<Hall />} />
        <Route path="/payment/:id" element={<Payment />} />
        <Route path="/ticket/:id" element={<Ticket />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
