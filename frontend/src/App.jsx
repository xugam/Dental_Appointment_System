import { useState, useEffect } from 'react';
import './App.css';

const API = '/dental';

function App() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    patientName: '',
    dentistName: '',
    dateTime: '',
    reason: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    patientName: '',
    dentistName: '',
    dateTime: '',
    reason: '',
    status: 'scheduled',
  });

  const fetchAppointments = async () => {
    try {
      setError(null);
      const res = await fetch(`${API}/appointments`);
      if (!res.ok) throw new Error('Failed to load appointments');
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientName.trim() || !form.dentistName.trim() || !form.dateTime.trim()) {
      setError('Patient name, dentist name and date/time are required.');
      return;
    }
    try {
      setError(null);
      const res = await fetch(`${API}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: form.patientName.trim(),
          dentistName: form.dentistName.trim(),
          dateTime: form.dateTime,
          reason: form.reason.trim() || '',
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to create appointment');
      }
      const created = await res.json();
      setAppointments((prev) => [...prev, created]);
      setForm({ patientName: '', dentistName: '', dateTime: '', reason: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toDateTimeLocal = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${day}T${h}:${min}`;
  };

  const handleEditClick = (apt) => {
    setEditingId(apt._id);
    setEditForm({
      patientName: apt.patientName || '',
      dentistName: apt.dentistName || '',
      dateTime: toDateTimeLocal(apt.dateTime),
      reason: apt.reason || '',
      status: apt.status || 'scheduled',
    });
  };

  const handleEditChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSubmit = async (e, id) => {
    e.preventDefault();
    if (!editForm.patientName.trim() || !editForm.dentistName.trim() || !editForm.dateTime.trim()) {
      setError('Patient name, dentist name and date/time are required.');
      return;
    }
    try {
      setError(null);
      const res = await fetch(`${API}/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: editForm.patientName.trim(),
          dentistName: editForm.dentistName.trim(),
          dateTime: editForm.dateTime,
          reason: editForm.reason.trim() || '',
          status: editForm.status,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to update appointment');
      }
      const updated = await res.json();
      setAppointments((prev) => prev.map((a) => (a._id === id ? updated : a)));
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    try {
      setError(null);
      const res = await fetch(`${API}/appointments/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete appointment');
      setAppointments((prev) => prev.filter((a) => a._id !== id));
      if (editingId === id) setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (d) => {
    if (!d) return '—';
    const dt = new Date(d);
    return dt.toLocaleString();
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Dental Appointments</h1>
      </header>

      <main className="main">
        <section className="form-section">
          <h2>New appointment</h2>
          <form onSubmit={handleSubmit} className="form">
            <label>
              Patient name
              <input
                name="patientName"
                value={form.patientName}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                required
              />
            </label>
            <label>
              Dentist name
              <input
                name="dentistName"
                value={form.dentistName}
                onChange={handleChange}
                placeholder="e.g. Dr. Smith"
                required
              />
            </label>
            <label>
              Date & time
              <input
                name="dateTime"
                type="datetime-local"
                value={form.dateTime}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Reason (optional)
              <input
                name="reason"
                value={form.reason}
                onChange={handleChange}
                placeholder="e.g. Checkup"
              />
            </label>
            <button type="submit">Book appointment</button>
          </form>
        </section>

        <section className="list-section">
          <h2>Upcoming appointments</h2>
          {error && <p className="error">{error}</p>}
          {loading && <p className="muted">Loading…</p>}
          {!loading && !error && appointments.length === 0 && (
            <p className="muted">No appointments yet. Create one above.</p>
          )}
          {!loading && appointments.length > 0 && (
            <ul className="appointment-list">
              {appointments.map((apt) => (
                <li key={apt._id} className="appointment-card">
                  {editingId === apt._id ? (
                    <form
                      className="edit-form"
                      onSubmit={(e) => handleEditSubmit(e, apt._id)}
                    >
                      <label>
                        Patient name
                        <input
                          name="patientName"
                          value={editForm.patientName}
                          onChange={handleEditChange}
                          required
                        />
                      </label>
                      <label>
                        Dentist name
                        <input
                          name="dentistName"
                          value={editForm.dentistName}
                          onChange={handleEditChange}
                          required
                        />
                      </label>
                      <label>
                        Date & time
                        <input
                          name="dateTime"
                          type="datetime-local"
                          value={editForm.dateTime}
                          onChange={handleEditChange}
                          required
                        />
                      </label>
                      <label>
                        Reason
                        <input
                          name="reason"
                          value={editForm.reason}
                          onChange={handleEditChange}
                        />
                      </label>
                      <label>
                        Status
                        <select
                          name="status"
                          value={editForm.status}
                          onChange={handleEditChange}
                        >
                          <option value="scheduled">scheduled</option>
                          <option value="completed">completed</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                      </label>
                      <div className="edit-actions">
                        <button type="submit">Save</button>
                        <button type="button" onClick={handleCancelEdit}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <span className="patient">{apt.patientName}</span>
                      <span className="dentist">with {apt.dentistName}</span>
                      <span className="datetime">{formatDate(apt.dateTime)}</span>
                      {apt.reason && <span className="reason">{apt.reason}</span>}
                      <span className={`status status-${apt.status}`}>{apt.status}</span>
                      <div className="card-actions">
                        <button
                          type="button"
                          className="btn-edit"
                          onClick={() => handleEditClick(apt)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn-delete"
                          onClick={() => handleDelete(apt._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
