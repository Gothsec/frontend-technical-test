import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createReservation,
  Passenger,
  EmergencyContact,
  Reservation,
} from "../../services/reservationService";

interface ReservationState {
  hotelId: string;
  roomId: string;
  city: string;
  checkIn: string;
  checkOut: string;
  persons: number;
}

interface ValidationErrors {
  passengers: Record<number, Partial<Record<keyof Passenger, string>>>;
  emergencyContact: Partial<Record<keyof EmergencyContact, string>>;
}

const ReservationForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ReservationState | null;

  const { hotelId, roomId, city, checkIn, checkOut, persons } = state ?? {};

  const [passengers, setPassengers] = useState<Passenger[]>(() =>
    Array.from({ length: persons ?? 0 }, () => ({
      firstName: "",
      lastName: "",
      birthDate: "",
      gender: "",
      documentType: "",
      documentNumber: "",
      email: "",
      phone: "",
    }))
  );

  const [emergencyContact, setEmergencyContact] = useState<EmergencyContact>({
    fullName: "",
    phone: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({
    passengers: {},
    emergencyContact: {},
  });

  const validateField = (
    field: string,
    value: string
  ): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const phonePattern = /^[0-9+ ]+$/;
    const documentPattern = /^[A-Za-z0-9]+$/;

    switch (field) {
      case "firstName":
      case "lastName":
        if (value.trim().length < 2) {
          return "Debe tener al menos 2 caracteres";
        }
        if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(value)) {
          return "Solo se permiten letras";
        }
        break;

      case "birthDate": {
        const birthDate = new Date(value);
        if (birthDate > today) {
          return "La fecha no puede ser en el futuro";
        }
        break;
      }

      case "email":
        if (!emailPattern.test(value)) {
          return "Correo electrónico inválido";
        }
        break;

      case "phone":
        if (!phonePattern.test(value)) {
          return "Solo se permiten números, espacios y el signo +";
        }
        if (value.trim().length < 7) {
          return "Número de teléfono demasiado corto";
        }
        break;

      case "documentNumber":
        if (!documentPattern.test(value)) {
          return "Solo se permiten letras y números sin espacios";
        }
        if (value.trim().length < 4) {
          return "Número de documento demasiado corto";
        }
        break;

      case "gender":
      case "documentType":
        if (!value) {
          return "Este campo es obligatorio";
        }
        break;

      case "fullName":
        if (value.trim().length < 5) {
          return "Ingrese el nombre completo";
        }
        if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(value)) {
          return "Solo se permiten letras";
        }
        break;

      default:
        break;
    }
    return "";
  };

  const handlePassengerChange = (
    index: number,
    field: keyof Passenger,
    value: string
  ) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);

    const errorMessage = validateField(field, value);

    setErrors((prev) => {
      const newErrors = { ...prev };
      if (!newErrors.passengers[index]) {
        newErrors.passengers[index] = {};
      }
      if (errorMessage) {
        newErrors.passengers[index][field] = errorMessage;
      } else {
        delete newErrors.passengers[index][field];
      }
      return newErrors;
    });
  };

  const handleEmergencyChange = (
    field: keyof EmergencyContact,
    value: string
  ) => {
    setEmergencyContact({ ...emergencyContact, [field]: value });

    const errorMessage = validateField(field, value);

    setErrors((prev) => {
      const newErrors = { ...prev };
      if (errorMessage) {
        newErrors.emergencyContact[field] = errorMessage;
      } else {
        delete newErrors.emergencyContact[field];
      }
      return newErrors;
    });
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: ValidationErrors = {
      passengers: {},
      emergencyContact: {},
    };

    passengers.forEach((passenger, index) => {
      newErrors.passengers[index] = {};
      Object.entries(passenger).forEach(([field, value]) => {
        const error = validateField(
          field,
          value.toString()
        );
        if (error) {
          newErrors.passengers[index][field as keyof Passenger] = error;
          isValid = false;
        }
      });
    });

    Object.entries(emergencyContact).forEach(([field, value]) => {
      const error = validateField(field, value);
      if (error) {
        newErrors.emergencyContact[field as keyof EmergencyContact] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstErrorElement = document.querySelector(".error-message");
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    const newReservation: Reservation = {
      hotelId: Number(hotelId!),
      roomId: Number(roomId!),
      city: city!,
      checkIn: checkIn!,
      checkOut: checkOut!,
      persons: persons!,
      passengers,
      emergencyContact,
    };

    try {
      await createReservation(newReservation);
      navigate("/success");
    } catch (error) {
      console.error("Error creating reservation:", error);
      // Manejar el error según corresponda
    }
  };

  if (!hotelId || !roomId || !checkIn || !checkOut) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">
          Faltan datos para completar la reserva. Regresa a la página anterior.
        </p>
      </div>
    );
  }

  const hasError = (
    type: "passengers" | "emergencyContact",
    index: number | null,
    field: string
  ): boolean => {
    if (type === "passengers" && index !== null) {
      return !!errors.passengers[index]?.[field as keyof Passenger];
    }
    if (type === "emergencyContact") {
      return !!errors.emergencyContact?.[field as keyof EmergencyContact];
    }
    return false;
  };

  const getErrorMessage = (
    type: "passengers" | "emergencyContact",
    index: number | null,
    field: string
  ): string => {
    if (type === "passengers" && index !== null) {
      return errors.passengers[index]?.[field as keyof Passenger] || "";
    }
    if (type === "emergencyContact") {
      return errors.emergencyContact?.[field as keyof EmergencyContact] || "";
    }
    return "";
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6"
      >
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">
          Datos de la Reserva
        </h2>
        <p className="mb-6 text-gray-700">
          Hotel ID: {hotelId} | Habitación ID: {roomId}
          <br />
          Ciudad: {city}
          <br />
          Entrada: {checkIn} | Salida: {checkOut}
          <br />
          Pasajeros: {persons}
        </p>

        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Datos de los Huéspedes
        </h3>
        {passengers.map((passenger, index) => (
          <div key={index} className="mb-6 border-b pb-4">
            <p className="font-semibold mb-2">Huésped {index + 1}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div>
                <label className="block text-gray-700 mb-1">Nombres</label>
                <input
                  type="text"
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none ${
                    hasError("passengers", index, "firstName")
                      ? "border-red-500"
                      : ""
                  }`}
                  value={passenger.firstName}
                  onChange={(e) =>
                    handlePassengerChange(index, "firstName", e.target.value)
                  }
                  required
                />
                {hasError("passengers", index, "firstName") && (
                  <p className="text-red-500 text-sm mt-1 error-message">
                    {getErrorMessage("passengers", index, "firstName")}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Apellidos</label>
                <input
                  type="text"
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none ${
                    hasError("passengers", index, "lastName")
                      ? "border-red-500"
                      : ""
                  }`}
                  value={passenger.lastName}
                  onChange={(e) =>
                    handlePassengerChange(index, "lastName", e.target.value)
                  }
                  required
                />
                {hasError("passengers", index, "lastName") && (
                  <p className="text-red-500 text-sm mt-1 error-message">
                    {getErrorMessage("passengers", index, "lastName")}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div>
                <label className="block text-gray-700 mb-1">
                  Fecha de Nacimiento
                </label>
                <input
                type="date"
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none ${
                    hasError("passengers", index, "birthDate")
                    ? "border-red-500"
                    : ""
                }`}
                value={passenger.birthDate}
                max={today}
                onChange={(e) =>
                    handlePassengerChange(index, "birthDate", e.target.value)
                }
                required
                />
                {!hasError("passengers", index, "birthDate") && (
                <p className="text-gray-500 text-xs mt-1">
                    La fecha no puede ser en el futuro
                </p>
                )}
                {hasError("passengers", index, "birthDate") && (
                  <p className="text-red-500 text-sm mt-1 error-message">
                    {getErrorMessage("passengers", index, "birthDate")}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Género</label>
                <select
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none ${
                    hasError("passengers", index, "gender")
                      ? "border-red-500"
                      : ""
                  }`}
                  value={passenger.gender}
                  onChange={(e) =>
                    handlePassengerChange(index, "gender", e.target.value)
                  }
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Otro">Otro</option>
                </select>
                {hasError("passengers", index, "gender") && (
                  <p className="text-red-500 text-sm mt-1 error-message">
                    {getErrorMessage("passengers", index, "gender")}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div>
                <label className="block text-gray-700 mb-1">
                  Tipo de Documento
                </label>
                <select
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none ${
                    hasError("passengers", index, "documentType")
                      ? "border-red-500"
                      : ""
                  }`}
                  value={passenger.documentType}
                  onChange={(e) =>
                    handlePassengerChange(index, "documentType", e.target.value)
                  }
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="DNI">DNI</option>
                  <option value="Pasaporte">Pasaporte</option>
                  <option value="Otro">Otro</option>
                </select>
                {hasError("passengers", index, "documentType") && (
                  <p className="text-red-500 text-sm mt-1 error-message">
                    {getErrorMessage("passengers", index, "documentType")}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 mb-1">N° Documento</label>
                <input
                  type="text"
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none ${
                    hasError("passengers", index, "documentNumber")
                      ? "border-red-500"
                      : ""
                  }`}
                  value={passenger.documentNumber}
                  onChange={(e) =>
                    handlePassengerChange(
                      index,
                      "documentNumber",
                      e.target.value
                    )
                  }
                  required
                />
                {hasError("passengers", index, "documentNumber") && (
                  <p className="text-red-500 text-sm mt-1 error-message">
                    {getErrorMessage("passengers", index, "documentNumber")}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none ${
                    hasError("passengers", index, "email")
                      ? "border-red-500"
                      : ""
                  }`}
                  value={passenger.email}
                  onChange={(e) =>
                    handlePassengerChange(index, "email", e.target.value)
                  }
                  required
                />
                {hasError("passengers", index, "email") && (
                  <p className="text-red-500 text-sm mt-1 error-message">
                    {getErrorMessage("passengers", index, "email")}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Teléfono</label>
                <input
                type="tel"
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none ${
                    hasError("passengers", index, "phone")
                    ? "border-red-500"
                    : ""
                }`}
                value={passenger.phone}
                onChange={(e) =>
                    handlePassengerChange(index, "phone", e.target.value)
                }
                placeholder="Ej: +51 999 888 777"
                pattern="[0-9+ ]+"
                required
                />
                {!hasError("passengers", index, "phone") && (
                <p className="text-gray-500 text-xs mt-1">
                    Solo se permiten números, espacios y el signo +
                </p>
                )}
                {hasError("passengers", index, "phone") && (
                  <p className="text-red-500 text-sm mt-1 error-message">
                    {getErrorMessage("passengers", index, "phone")}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Contacto de Emergencia
        </h3>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Nombres Completos</label>
          <input
            type="text"
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none ${
              hasError("emergencyContact", null, "fullName")
                ? "border-red-500"
                : ""
            }`}
            value={emergencyContact.fullName}
            onChange={(e) => handleEmergencyChange("fullName", e.target.value)}
            required
          />
          {hasError("emergencyContact", null, "fullName") && (
            <p className="text-red-500 text-sm mt-1 error-message">
              {getErrorMessage("emergencyContact", null, "fullName")}
            </p>
          )}
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-1">
            Teléfono de Contacto
          </label>
        <input
        type="tel"
        className={`w-full border rounded-lg px-3 py-2 focus:outline-none ${
            hasError("emergencyContact", null, "phone")
            ? "border-red-500"
            : ""
        }`}
        value={emergencyContact.phone}
        onChange={(e) => handleEmergencyChange("phone", e.target.value)}
        placeholder="Ej: +51 999 888 777"
        pattern="[0-9+ ]+"
        required
        />
        {!hasError("emergencyContact", null, "phone") && (
        <p className="text-gray-500 text-xs mt-1">
            Solo se permiten números, espacios y el signo +
        </p>
        )}
          {hasError("emergencyContact", null, "phone") && (
            <p className="text-red-500 text-sm mt-1 error-message">
              {getErrorMessage("emergencyContact", null, "phone")}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition cursor-pointer"
        >
          Reservar
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;
