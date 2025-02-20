import { useNavigate } from 'react-router-dom';

const ReservationSuccess = () => {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow p-8 max-w-md text-center">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">¡Reserva Exitosa!</h2>
        <p className="text-gray-700 mb-4">
          Tu reserva se ha realizado correctamente. Recibirás un correo electrónico con los
          detalles de la reserva.
        </p>
        <button
          onClick={goToHome}
          className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition cursor-pointer"
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default ReservationSuccess;
