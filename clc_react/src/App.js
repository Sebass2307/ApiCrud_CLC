import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert, Button, Modal, InputGroup, FormControl } from 'react-bootstrap';
import Swal from 'sweetalert2';
import Footer from './Footer';

function App() {
  const [data, setData] = useState([]);
  const [newPerson, setNewPerson] = useState({
    name: '',
    age: '',
    rut: '',
    dv: '',
    sexo: '',
    prev_Salud: '',
    telefono: '',
    correo: '',
    fecha_Ingreso: ''
  });
  const [editItem, setEditItem] = useState(null);
  const [isAddingModalOpen, setIsAddingModalOpen] = useState(false);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [searchRut, setSearchRut] = useState('');
  const [limit, setLimit] = useState(30);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    axios.get(`https://localhost:44384/api/Person?limit=${limit}`)
      .then(response => {
        const sortedData = response.data
          .map(item => ({ ...item, id: Number(item.id) }))
          .sort((a, b) => a.id - b.id);
  
        setData(sortedData);
        setLoading(false);
      })
      .catch(error => {
        console.error("Hubo un error!", error);
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchData();
  }, [limit]);
  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50) {
      setLimit((prevLimit) => prevLimit + 10);
    }
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    axios.get('https://localhost:44384/api/Person')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error("Hubo un error!", error);
      });
  }, []);
  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`https://localhost:44384/api/Person/${id}`)
          .then(response => {
            setData(data.filter(item => item.id !== id));
            Swal.fire('¡Eliminado!', 'La persona ha sido eliminado.', 'success');
          })
          .catch(error => {
            console.error("Hubo un error al eliminar el item!", error);
          });
      }
    });
  };  
  const handleEdit = (item) => {
    setEditItem(item);
    setIsEditingModalOpen(true);
  };
  const handleUpdate = () => {
    axios.put(`https://localhost:44384/api/Person/${editItem.id}`, editItem)
      .then(response => {
        setData(data.map(item => (item.id === editItem.id ? editItem : item)));
        setEditItem(null);
        setIsEditingModalOpen(false);
        Swal.fire({
          icon: 'success',
          title: 'Los datos han sido modificados correctamente',
          confirmButtonText: 'OK'
        });
      })
      .catch(error => {
        console.error("Hubo un error al actualizar el item!", error);
      });
  };
const handleCreate = () => {
    axios.post('https://localhost:44384/api/Person', newPerson)
      .then(response => {
        setData([...data, response.data]);
        setNewPerson({
          name: '',
          age: '',
          rut: '',
          dv: '',
          sexo: '',
          prev_Salud: '',
          telefono: '',
          correo: '',
          fecha_Ingreso: ''
        });
        setIsAddingModalOpen(false);
        Swal.fire({
          icon: 'success',
          title: 'Persona añadida correctamente',
          showConfirmButton: false,
          timer: 1500
        });
      })
      .catch(error => {
        console.error("Hubo un error al crear la persona!", error);
      });
};
const handleSearchByRut = () => {
  // Lógica para buscar por RUT en la API
  axios.get(`https://localhost:44384/api/Person/searchByRut?rut=${searchRut}`)
    .then(response => {
      if (response.data.length > 0) {
        setData(response.data);
      } else {
        alert('RUT no encontrado');
      }
    })
    .catch(error => {
      console.error("Hubo un error al buscar por RUT!", error);
    });
};
useEffect(() => {
  if (searchRut === '') {
    axios.get('https://localhost:44384/api/Person')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error("Hubo un error al reiniciar los datos!", error);
      });
  }
}, [searchRut]);


  return (
    <div className="header">
      <div className="header d-flex align-items-center" style={{maxHeight:"100%"}}>
        <img src="/clc.png" alt="clc" style={{ width:"10%",padding:"2px"}} />
        <div className="button-container d-flex w-100 mb-3" >
          {/* Input de Búsqueda y Botones */}
          <InputGroup className="me-3" style={{ width: '35%', height: '2.5rem', marginLeft: '45px' }}>
          <FormControl
            placeholder="Buscar por RUT"
            value={searchRut}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,8}$/.test(value)) {
                setSearchRut(value);
              } else {
                alert('Solo se pueden ingresar números.');
              }
            }}
            style={{ height: '100%', borderRadius: "1rem 0 0 1rem" }}/>
            <Button variant="secondary" onClick={handleSearchByRut} style={{ height: '100%', borderRadius: "0 1rem 1rem 0" }}>
              Buscar
            </Button>
            <Button variant="secondary" onClick={() => window.location.reload()} style={{ height: '100%', borderRadius: " 1rem", marginLeft: "5px" }}>
              Refrescar
            </Button>
          </InputGroup>
          <Button 
            className="btn ms-auto rounded-button" 
            onClick={() => setIsAddingModalOpen(true)} 
            style={{ 
              backgroundColor: '#c3d101', 
              color: 'black', 
              border: '2px solid #536dab', 
              transition: 'background-color 0.3s, border-color 0.3s'
            }} 
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#A0AA04';
              e.target.style.borderColor = '#536dab';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#c3d101';
              e.target.style.borderColor = '#536dab';
            }}>
            Añadir Personas
          </Button>
        </div>
      </div>
      
      {/* Modal para Añadir Persona */}
      <Modal show={isAddingModalOpen} onHide={() => setIsAddingModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Añadir Persona</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
            <div className="mb-3">
              <input type="text" className="form-control" value={newPerson.name} onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })} placeholder="Nombre" required maxLength="50"/>
            </div>
            <div className="mb-3">
            <input type="number"className="form-control"value={newPerson.age}onChange={(e) => {const value = e.target.value;
                if (/^\d{0,3}$/.test(value) && (value === '' || parseInt(value) < 124)) {
                  setNewPerson({ ...newPerson, age: value });
                } else {
                  alert("Por favor, ingrese un número con un máximo de 3 dígitos y menor que 123.");
                }
              }}placeholder="Edad"required/>
              </div>
              <div className="mb-3 d-flex align-items-center">
                <input
                  type="text"
                  className="form-control me-2"
                  style={{ width: '150px' }} 
                  value={newPerson.rut}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,8}$/.test(value)) {
                      setNewPerson({ ...newPerson, rut: value });
                    } else {
                      alert("Por favor, ingrese solo números y un máximo de 8 caracteres.");
                    }
                  }}
                  placeholder="Rut sin puntos"
                  required  />
                <span className="mx-2">-</span> {/* Guion entre Rut y Digito Verificador */}
                <input
                  type="text"
                  className="form-control ms-2"
                  style={{ width: '50px' }}
                  value={newPerson.dv}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase(); 
                    if (/^[0-9kK]?$/.test(value)) {
                      setNewPerson({ ...newPerson, dv: value });
                    } else {
                      alert("Por favor, ingrese un número del 0 al 9 o la letra 'k'/'K'.");
                    }
                  }}
                  placeholder="DV"
                  required/>
              </div>
            <div className="mb-3">
              <select
                className="form-control"
                value={newPerson.sexo}
                onChange={(e) => setNewPerson({ ...newPerson, sexo: e.target.value })}
                required>
                <option value="" disabled>
                  Selecciona Sexo
                </option>
                <option value="M">M</option>
                <option value="F">F</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div className="mb-3">
              <input type="text" className="form-control" value={newPerson.prev_Salud} onChange={(e) => setNewPerson({ ...newPerson, prev_Salud: e.target.value })} placeholder="Previsión de Salud" required maxLength="50"/>
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                value={newPerson.telefono}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,9}$/.test(value)) {
                    setNewPerson({ ...newPerson, telefono: value });
                  } else {
                    alert("Por favor, ingrese solo números y un máximo de 9 caracteres.");
                  }
                }}
                placeholder="Teléfono"
                required/>
            </div>
            <div className="mb-3">
              <input type="email" className="form-control" value={newPerson.correo} onChange={(e) => setNewPerson({ ...newPerson, correo: e.target.value })} placeholder="Correo electrónico" required  maxLength="50" />
            </div>
            <div className="mb-3">
            <label className="form-label label-opacity">
              Fecha de Ingreso
            </label>
              <input type="date" className="form-control" value={newPerson.fecha_Ingreso} onChange={(e) => setNewPerson({ ...newPerson, fecha_Ingreso: e.target.value })} placeholder="Fecha de Ingreso" required />
            </div>
            <Button type="submit" className="btn btn-success">Añadir</Button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Modal para Editar Persona */}
      <Modal show={isEditingModalOpen} onHide={() => setIsEditingModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Persona</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
            <div className="mb-3">
            <label className="form-label label-opacity">
              Nombre
            </label>
              <input type="text" className="form-control" value={editItem?.name} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} placeholder="Nombre" required maxLength="50"/>
            </div>
            <div className="mb-3">
              <label className="form-label label-opacity">
                Edad
              </label>
              <input
                type="text"
                className="form-control"
                value={editItem?.age}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,3}$/.test(value) && (value === '' || parseInt(value) < 125)) {
                    setEditItem({ ...editItem, age: value });
                  } else {
                    alert("Por favor, ingrese un número con un máximo de 3 dígitos y menor que 124.");
                  }
                }}
                placeholder="Edad"
                required/>
            </div>
            <div className="mb-3 d-flex align-items-center">
              <label className="label-opacity me-2 ">
                RUT
              </label>
              <input
                type="text"
                className="form-control me-2"
                style={{ width: '150px' }}
                value={editItem?.rut}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[0-9]{0,8}$/.test(value)) {
                    setEditItem({ ...editItem, rut: value });
                  } else {
                    alert("Por favor, ingrese solo números. El RUT debe tener un máximo de 8 caracteres.");
                  }
                }}
                placeholder="Rut sin puntos"
                required/>
              <span>-</span>
              <input 
                type="text"
                className="form-control ms-2"
                style={{ width: '50px' }}
                value={editItem?.dv}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  if (/^[0-9K]?$/.test(value)) {
                    setEditItem({ ...editItem, dv: value });
                  } else {
                    alert("Por favor, ingrese un número del 0 al 9 o la letra 'k'/'K'.");
                  }
                }}
                placeholder="DV"
                required/>
            </div>
            <label className="form-label label-opacity">
              Sexo
            </label>
            <div className="mb-3">
              <select
                className="form-control"
                value={editItem?.sexo}
                onChange={(e) => setEditItem({ ...editItem, sexo: e.target.value })}
                required>
                <option value="" disabled>
                  Selecciona Sexo
                </option>
                <option value="M">M</option>
                <option value="F">F</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <label className="form-label label-opacity">
              Previsión de  Salud
            </label>
            <div className="mb-3">
              <input type="text" className="form-control" value={editItem?.prev_Salud} onChange={(e) => setEditItem({ ...editItem, prev_Salud: e.target.value })} placeholder="Previsión de Salud" required maxLength="50"/>
            </div>
            <div className="mb-3">
              <label className="form-label label-opacity">
                Teléfono
              </label>
              <input
                type="text"
                className="form-control"
                value={editItem?.telefono}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,9}$/.test(value)) {
                    setEditItem({ ...editItem, telefono: value });
                  } else {
                    alert("Por favor, ingrese solo números y un máximo de 9 caracteres.");
                  }
                }}
                placeholder="Teléfono"
                required/>
            </div>
            <label className="form-label label-opacity">
              Correo electrónico
            </label>
            <div className="mb-3">
              <input type="email" className="form-control" value={editItem?.correo} onChange={(e) => setEditItem({ ...editItem, correo: e.target.value })} placeholder="Correo electrónico" required  maxLength="50"/>
            </div>
            <label className="form-label label-opacity">
              Fecha ingreso
            </label>
            <div className="mb-3">
            <input type="date"className="form-control"value={editItem?.fecha_Ingreso ? new Date(editItem.fecha_Ingreso).toISOString().split('T')[0] : ''}onChange={(e) => setEditItem({ ...editItem, fecha_Ingreso: e.target.value })}placeholder="Fecha de Ingreso"required/>
            </div>
            <Button type="submit" className="btn btn-success">Actualizar</Button>
          </form>
        </Modal.Body>
      </Modal>

      {/*Tabla de datos*/}
      <div className="table-container">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Edad</th>
              <th>RUT</th>
              <th>DV</th>
              <th>Sexo</th>
              <th>Previsión de Salud</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Fecha de Ingreso</th>
              <th className="action-cell">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data
              .slice()
              .sort((a, b) => a.id - b.id) // Ordena por ID
              .map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.age}</td>
                  <td>{item.rut}</td>
                  <td>{item.dv}</td>
                  <td>{item.sexo}</td>
                  <td>{item.prev_Salud}</td>
                  <td>{item.telefono}</td>
                  <td>{item.correo}</td>
                  <td>{new Date(item.fecha_Ingreso).toLocaleDateString()}</td>
                  <td className="action-cell">
                    <Button className="btn-sm btn-warning me-2" onClick={() => handleEdit(item)}>Modificar</Button>
                    <Button className="btn-sm btn-danger" onClick={() => handleDelete(item.id)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {loading && <div>Cargando...</div>}
      </div>
      <Footer />
    </div>
  );
}
export default App;
