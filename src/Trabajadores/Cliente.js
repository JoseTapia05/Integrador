import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Calificaciones = () => {
  const [clientes, setClientes] = useState([]);

  const fetchClientes = async () => {
    try {
      const response = await fetch('https://alex.starcode.com.mx/apiAlumnos.php');
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchClientes();
    const intervalId = setInterval(fetchClientes, 5000); // Actualiza cada 5 segundos
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="container">
      <h1 className="text-center my-4">CALIFICACIONES DEL ING. ALEX RAMÍREZ GALINDO</h1>
      <div className="row">
        {clientes.map((cliente) => {
          // Calcular el promedio
          const scores = Object.values(cliente.practicas).map(Number);
          const average = scores.reduce((a, b) => a + b, 0) / scores.length;

          // Configurar los datos del gráfico para mostrar solo el promedio
          const chartData = {
            labels: ['Promedio'],
            datasets: [
              {
                label: 'Promedio de Calificaciones',
                data: [average],
                backgroundColor: average >= 7 ? '#4bc0c0' : '#ff6384', // Verde si aprobó, rojo si reprobó
              },
            ],
          };

          return (
            <div className="col-md-6 mb-4" key={cliente.id}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Identificación: {cliente.id}</h5>
                  <p className="card-text"><strong>Cuenta:</strong> {cliente.cuenta}</p>
                  <p className="card-text"><strong>Nombre:</strong> {cliente.nombre}</p>
                  <div className="chart-container mb-3">
                    <Bar data={chartData} options={{ responsive: true, scales: { y: { max: 10 } } }} />
                  </div>
                  <p className="card-text"><strong>Promedio:</strong> {average.toFixed(1)}</p>
                  <button className={`btn ${average >= 7 ? 'btn-success' : 'btn-danger'} w-100`}>
                    {average >= 7 ? 'Aprobado' : 'Reprobado'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calificaciones;
