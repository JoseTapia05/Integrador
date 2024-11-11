import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './ListaClientes.css'; // Asegúrate de crear este archivo y aplicarle estilos personalizados

ChartJS.register(ArcElement, Tooltip, Legend);

const ListaClientes = () => {
  const [clientes, setClientes] = useState([]);

  const fetchClientes = async () => {
    try {
      const response = await fetch('https://alex.starcode.com.mx/apiBD.php');
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

  // Colores para alternar en las tarjetas
  const cardColors = ['bg-primary', 'bg-success', 'bg-warning', 'bg-danger'];

  // Contar el número de hombres y mujeres
  const maleCount = clientes.filter(cliente => cliente.sexo === 'M').length;
  const femaleCount = clientes.filter(cliente => cliente.sexo === 'F').length;

  const chartData = {
    labels: ['Hombres', 'Mujeres'],
    datasets: [
      {
        label: 'Distribución de Género',
        data: [maleCount, femaleCount],
        backgroundColor: ['#36a2eb', '#ff6384'],
        hoverBackgroundColor: ['#36a2ebcc', '#ff6384cc'],
      },
    ],
  };

  return (
    <div className="container clientes-container">
      <h1 className="text-center titulo-principal">LISTA DE CLIENTES</h1>
      <div className="row">
        {clientes.map((cliente, index) => (
          <div className="col-md-3 mb-4" key={cliente.id}>
            <div className={`card text-white ${cardColors[index % cardColors.length]} cliente-card`}>
              <div className="card-body">
                <h5 className="card-title titulo-card">ID: {cliente.id}</h5>
                <p className="card-text texto-card"><strong>Nombre:</strong> {cliente.nombre}</p>
                <p className="card-text texto-card"><strong>Telefono:</strong> {cliente.telefono}</p>
                <p className="card-text texto-card"><strong>Sexo:</strong> {cliente.sexo}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <h2 className="text-center subtitulo-grafica">Distribución de Género</h2>
      <div className="chart-container d-flex justify-content-center">
        <div className="grafica-pie">
          <Pie data={chartData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default ListaClientes;
