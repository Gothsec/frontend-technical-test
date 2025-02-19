import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HotelSearch from './components/Client/HotelSearch';
import RoomsSelection from './components/Client/RoomSelection';
import ReservationForm from './components/Client/ReservationForm';
import ReservationSuccess from './components/Client/ReservationSuccess';

import AgentLogin from './components/Agent/AgentLogin';
import AgentDashboard from './components/Agent/AgentDashboard';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HotelSearch />} />
        <Route path="/rooms" element={<RoomsSelection />} />
        <Route path="/reservation" element={<ReservationForm />} />
        <Route path="/success" element={<ReservationSuccess />} />

        <Route path="/login" element={<AgentLogin />} />
        <Route path="/dashboard" element={<AgentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
