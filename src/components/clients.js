
import { useEffect, useState } from "react";
import api from "../services/api";
import "./Clients.css";

export default function Clients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [formData, setFormData] = useState({
        cin: "",
        nom: "",
        email: "",
        age: "",
        civilite: "Male"
    });

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = () => {
        api.get("/exercice/revision/getAll/client") 
           .then(res => {
                console.log(res.data);
             
                const clientData = Array.isArray(res.data.Client) 
                    ? res.data.Client 
                    : [res.data.Client];
                setClients(clientData);
                setLoading(false);
           })
           .catch(err => {
               console.error(err);
               setLoading(false);
           });
    };

    const filteredClients = clients.filter(client => {
        const searchLower = searchTerm.toLowerCase();
        return (
            client.nom.toLowerCase().includes(searchLower) ||
            client.id.toString().includes(searchTerm)
        );
    });

    const handleAddClient = () => {
        setEditingClient(null);
        setFormData({
            cin: "",
            nom: "",
            email: "",
            age: "",
            civilite: "Male"
        });
        setShowModal(true);
    };

    const handleEditClient = (client) => {
        setEditingClient(client);
        setFormData({
            cin: client.cin,
            nom: client.nom,
            email: client.email,
            age: client.age,
            civilite: client.civilite
        });
        setShowModal(true);
    };

    const handleDeleteClient = (clientId) => {
        if (window.confirm("Are you sure you want to delete this client?")) {
            api.delete(`/exercice/revision/delete/client/${clientId}`)
               .then(() => {
                   setClients(clients.filter(c => c.id !== clientId));
                   alert("Client deleted successfully!");
               })
               .catch(err => {
                   console.error(err);
                   alert("Error deleting client");
               });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingClient) {
          
            api.put(`/exercice/revision/update/client/${editingClient.id}`, formData)
               .then(() => {
                   fetchClients();
                   setShowModal(false);
                   alert("Client updated successfully!");
               })
               .catch(err => {
                   console.error(err);
                   alert("Error updating client");
               });
        } else {
         
            api.post("/exercice/revision/add/client", formData)
               .then(() => {
                   fetchClients();
                   setShowModal(false);
                   alert("Client added successfully!");
               })
               .catch(err => {
                   console.error(err);
                   alert("Error adding client");
               });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) {
        return <div className="loading">Loading clients...</div>;
    }

    return (
        <div className="container">
            <h1 className="title">Clients List</h1>
            
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                {searchTerm && (
                    <button 
                        onClick={() => setSearchTerm("")}
                        className="clear-button"
                    >
                        ✕
                    </button>
                )}
            </div>

            <div className="add-button-container">
                <button onClick={handleAddClient} className="add-button">
                    + Add New Client
                </button>
            </div>

            {filteredClients.length === 0 && !loading && (
                <div className="no-results">
                    No clients found matching "{searchTerm}"
                </div>
            )}

            <div className="cards-grid">
                {filteredClients.map(client => (
                    <div key={client.id} className="card">
                        <div className="card-header">
                            <h3 className="client-name">{client.nom}</h3>
                            <span className={`civilite ${client.civilite.toLowerCase()}`}>
                                {client.civilite}
                            </span>
                        </div>
                        <div className="card-body">
                            <div className="info-row">
                                <span className="label">CIN:</span>
                                <span className="value">{client.cin}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Email:</span>
                                <span className="value">{client.email}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Age:</span>
                                <span className="value">{client.age} years</span>
                            </div>
                            <div className="info-row">
                                <span className="label">ID:</span>
                                <span className="value">#{client.id}</span>
                            </div>
                        </div>
                        <div className="card-actions">
                            <button 
                                onClick={() => handleEditClient(client)}
                                className="action-button edit-button"
                            >
                                ✏️ Edit
                            </button>
                            <button 
                                onClick={() => handleDeleteClient(client.id)}
                                className="action-button delete-button"
                            >
                                🗑️ Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">
                            {editingClient ? "Edit Client" : "Add New Client"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>CIN:</label>
                                <input
                                    type="text"
                                    name="cin"
                                    value={formData.cin}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Age:</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Civilité:</label>
                                <select
                                    name="civilite"
                                    value={formData.civilite}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="submit-button">
                                    {editingClient ? "Update" : "Add"}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setShowModal(false)}
                                    className="cancel-button"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}