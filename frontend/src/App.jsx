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
  const [view, setView] = useState('appointments');

  // Patients
  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [patientsError, setPatientsError] = useState(null);
  const [patientForm, setPatientForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [patientFormErrors, setPatientFormErrors] = useState({});
  const [patientEditingId, setPatientEditingId] = useState(null);
  const [patientEditForm, setPatientEditForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [patientEditFormErrors, setPatientEditFormErrors] = useState({});

  // Dentists
  const [dentists, setDentists] = useState([]);
  const [dentistsLoading, setDentistsLoading] = useState(false);
  const [dentistsError, setDentistsError] = useState(null);
  const [dentistForm, setDentistForm] = useState({ name: '', specialization: '', experience: '', phone: '' });
  const [dentistFormErrors, setDentistFormErrors] = useState({});
  const [dentistEditingId, setDentistEditingId] = useState(null);
  const [dentistEditForm, setDentistEditForm] = useState({ name: '', specialization: '', experience: '', phone: '' });
  const [dentistEditFormErrors, setDentistEditFormErrors] = useState({});

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

  const fetchPatients = async () => {
    try {
      setPatientsError(null);
      setPatientsLoading(true);
      const res = await fetch(`${API}/patients`);
      if (!res.ok) throw new Error('Failed to load patients');
      const data = await res.json();
      setPatients(data);
    } catch (err) {
      setPatientsError(err.message);
    } finally {
      setPatientsLoading(false);
    }
  };

  const fetchDentists = async () => {
    try {
      setDentistsError(null);
      setDentistsLoading(true);
      const res = await fetch(`${API}/dentists`);
      if (!res.ok) throw new Error('Failed to load dentists');
      const data = await res.json();
      setDentists(data);
    } catch (err) {
      setDentistsError(err.message);
    } finally {
      setDentistsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDentists();
  }, []);

  // Validation helpers
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const digitsOnly = phone.toString().replace(/\D/g, '');
    return digitsOnly.length === 10;
  };

  const validateDateTime = (dateTime) => {
    if (!dateTime) return false;
    const selected = new Date(dateTime);
    const now = new Date();
    return selected > now;
  };

  const validateAppointment = (formData) => {
    const errors = {};
    if (!formData.patientName?.trim()) errors.patientName = 'Patient is required';
    if (!formData.dentistName?.trim()) errors.dentistName = 'Dentist is required';
    if (!formData.dateTime?.trim()) {
      errors.dateTime = 'Date & time is required';
    } else if (!validateDateTime(formData.dateTime)) {
      errors.dateTime = 'Date & time must be in the future';
    }
    return errors;
  };

  const validatePatient = (formData) => {
    const errors = {};
    if (!formData.name?.trim()) errors.name = 'Name is required';
    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.phone?.trim()) {
      errors.phone = 'Phone is required';
    } else if (!validatePhone(formData.phone)) {
      errors.phone = 'Phone number must be exactly 10 digits';
    }
    return errors;
  };

  const validateDentist = (formData) => {
    const errors = {};
    if (!formData.name?.trim()) errors.name = 'Name is required';
    if (!formData.specialization?.trim()) errors.specialization = 'Specialization is required';
    if (!formData.experience?.toString().trim()) {
      errors.experience = 'Experience is required';
    } else {
      const exp = Number(formData.experience);
      if (isNaN(exp) || exp < 0) {
        errors.experience = 'Experience must be a positive number';
      }
    }
    if (!formData.phone?.toString().trim()) {
      errors.phone = 'Phone is required';
    } else {
      const phoneStr = formData.phone.toString();
      if (!validatePhone(phoneStr)) {
        errors.phone = 'Phone number must be exactly 10 digits';
      }
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateAppointment(form);
    if (Object.keys(errors).length > 0) {
      setError(Object.values(errors)[0]);
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
    const errors = validateAppointment(editForm);
    if (Object.keys(errors).length > 0) {
      setError(Object.values(errors)[0]);
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

  // --- Patients ---
  const handlePatientChange = (e) => {
    const { name, value } = e.target;
    setPatientForm((p) => ({ ...p, [name]: value }));
    if (patientFormErrors[name]) {
      setPatientFormErrors((err) => ({ ...err, [name]: '' }));
    }
  };
  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    const errors = validatePatient(patientForm);
    if (Object.keys(errors).length > 0) {
      setPatientFormErrors(errors);
      setPatientsError(Object.values(errors)[0]);
      return;
    }
    try {
      setPatientsError(null);
      setPatientFormErrors({});
      const phoneNormalized = patientForm.phone.replace(/\D/g, '');
      const res = await fetch(`${API}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...patientForm, phone: phoneNormalized }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to create patient');
      }
      const created = await res.json();
      setPatients((prev) => [...prev, created]);
      setPatientForm({ name: '', email: '', phone: '', address: '' });
      setPatientFormErrors({});
    } catch (err) {
      setPatientsError(err.message);
    }
  };
  const handlePatientEditClick = (p) => {
    setPatientEditingId(p._id);
    setPatientEditForm({ name: p.name || '', email: p.email || '', phone: p.phone || '', address: p.address || '' });
    setPatientEditFormErrors({});
  };
  const handlePatientEditChange = (e) => {
    const { name, value } = e.target;
    setPatientEditForm((p) => ({ ...p, [name]: value }));
    if (patientEditFormErrors[name]) {
      setPatientEditFormErrors((err) => ({ ...err, [name]: '' }));
    }
  };
  const handlePatientEditSubmit = async (e, id) => {
    e.preventDefault();
    const errors = validatePatient(patientEditForm);
    if (Object.keys(errors).length > 0) {
      setPatientEditFormErrors(errors);
      setPatientsError(Object.values(errors)[0]);
      return;
    }
    try {
      setPatientsError(null);
      setPatientEditFormErrors({});
      const phoneNormalized = patientEditForm.phone.replace(/\D/g, '');
      const res = await fetch(`${API}/patients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...patientEditForm, phone: phoneNormalized }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to update patient');
      }
      const updated = await res.json();
      setPatients((prev) => prev.map((x) => (x._id === id ? updated : x)));
      setPatientEditingId(null);
    } catch (err) {
      setPatientsError(err.message);
    }
  };
  const handlePatientDelete = async (id) => {
    if (!window.confirm('Delete this patient?')) return;
    try {
      setPatientsError(null);
      const res = await fetch(`${API}/patients/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete patient');
      setPatients((prev) => prev.filter((x) => x._id !== id));
      if (patientEditingId === id) setPatientEditingId(null);
    } catch (err) {
      setPatientsError(err.message);
    }
  };

  // --- Dentists ---
  const handleDentistChange = (e) => {
    const { name, value } = e.target;
    setDentistForm((d) => ({ ...d, [name]: value }));
    if (dentistFormErrors[name]) {
      setDentistFormErrors((err) => ({ ...err, [name]: '' }));
    }
  };
  const handleDentistSubmit = async (e) => {
    e.preventDefault();
    const errors = validateDentist(dentistForm);
    if (Object.keys(errors).length > 0) {
      setDentistFormErrors(errors);
      setDentistsError(Object.values(errors)[0]);
      return;
    }
    try {
      setDentistsError(null);
      setDentistFormErrors({});
      const phoneNormalized = dentistForm.phone.toString().replace(/\D/g, '');
      const res = await fetch(`${API}/dentists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: dentistForm.name.trim(),
          specialization: dentistForm.specialization.trim(),
          experience: Number(dentistForm.experience),
          phone: Number(phoneNormalized),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to create dentist');
      }
      const created = await res.json();
      setDentists((prev) => [...prev, created]);
      setDentistForm({ name: '', specialization: '', experience: '', phone: '' });
      setDentistFormErrors({});
    } catch (err) {
      setDentistsError(err.message);
    }
  };
  const handleDentistEditClick = (d) => {
    setDentistEditingId(d._id);
    setDentistEditForm({
      name: d.name || '',
      specialization: d.specialization || '',
      experience: d.experience ?? '',
      phone: d.phone ?? '',
    });
    setDentistEditFormErrors({});
  };
  const handleDentistEditChange = (e) => {
    const { name, value } = e.target;
    setDentistEditForm((d) => ({ ...d, [name]: value }));
    if (dentistEditFormErrors[name]) {
      setDentistEditFormErrors((err) => ({ ...err, [name]: '' }));
    }
  };
  const handleDentistEditSubmit = async (e, id) => {
    e.preventDefault();
    const errors = validateDentist(dentistEditForm);
    if (Object.keys(errors).length > 0) {
      setDentistEditFormErrors(errors);
      setDentistsError(Object.values(errors)[0]);
      return;
    }
    try {
      setDentistsError(null);
      setDentistEditFormErrors({});
      const phoneNormalized = dentistEditForm.phone.toString().replace(/\D/g, '');
      const res = await fetch(`${API}/dentists/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: dentistEditForm.name.trim(),
          specialization: dentistEditForm.specialization.trim(),
          experience: Number(dentistEditForm.experience),
          phone: Number(phoneNormalized),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to update dentist');
      }
      const updated = await res.json();
      setDentists((prev) => prev.map((x) => (x._id === id ? updated : x)));
      setDentistEditingId(null);
    } catch (err) {
      setDentistsError(err.message);
    }
  };
  const handleDentistDelete = async (id) => {
    if (!window.confirm('Delete this dentist?')) return;
    try {
      setDentistsError(null);
      const res = await fetch(`${API}/dentists/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete dentist');
      setDentists((prev) => prev.filter((x) => x._id !== id));
      if (dentistEditingId === id) setDentistEditingId(null);
    } catch (err) {
      setDentistsError(err.message);
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
        <nav className="tabs">
          <button
            className={view === 'appointments' ? 'tab active' : 'tab'}
            onClick={() => setView('appointments')}
          >
            Appointments
          </button>
          <button
            className={view === 'patients' ? 'tab active' : 'tab'}
            onClick={() => setView('patients')}
          >
            Patients
          </button>
          <button
            className={view === 'dentists' ? 'tab active' : 'tab'}
            onClick={() => setView('dentists')}
          >
            Dentists
          </button>
        </nav>
      </header>

      <main className="main">
        {view === 'appointments' && (
          <>
        <section className="form-section">
          <h2>New appointment</h2>
          <form onSubmit={handleSubmit} className="form">
            <label>
              Patient
              <select
                name="patientName"
                value={form.patientName}
                onChange={handleChange}
                required
              >
                <option value="">Select patient</option>
                {patients.map((p) => (
                  <option key={p._id} value={p.name}>{p.name}</option>
                ))}
              </select>
              {patients.length === 0 && <span className="field-hint">Add patients in the Patients tab</span>}
            </label>
            <label>
              Dentist
              <select
                name="dentistName"
                value={form.dentistName}
                onChange={handleChange}
                required
              >
                <option value="">Select dentist</option>
                {dentists.map((d) => (
                  <option key={d._id} value={d.name}>{d.name}</option>
                ))}
              </select>
              {dentists.length === 0 && <span className="field-hint">Add dentists in the Dentists tab</span>}
            </label>
            <label>
              Date & time
              <input
                name="dateTime"
                type="datetime-local"
                value={form.dateTime}
                onChange={handleChange}
                required
                min={new Date().toISOString().slice(0, 16)}
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
                        Patient
                        <select
                          name="patientName"
                          value={editForm.patientName}
                          onChange={handleEditChange}
                          required
                        >
                          <option value="">Select patient</option>
                          {patients.map((p) => (
                            <option key={p._id} value={p.name}>{p.name}</option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Dentist
                        <select
                          name="dentistName"
                          value={editForm.dentistName}
                          onChange={handleEditChange}
                          required
                        >
                          <option value="">Select dentist</option>
                          {dentists.map((d) => (
                            <option key={d._id} value={d.name}>{d.name}</option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Date & time
                        <input
                          name="dateTime"
                          type="datetime-local"
                          value={editForm.dateTime}
                          onChange={handleEditChange}
                          required
                          min={new Date().toISOString().slice(0, 16)}
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
          </>
        )}

        {view === 'patients' && (
          <>
            <section className="form-section">
              <h2>New patient</h2>
              <form onSubmit={handlePatientSubmit} className="form">
                <label>
                  Name
                  <input name="name" value={patientForm.name} onChange={handlePatientChange} required className={patientFormErrors.name ? 'error' : ''} />
                  {patientFormErrors.name && <span className="field-error">{patientFormErrors.name}</span>}
                </label>
                <label>
                  Email
                  <input name="email" type="email" value={patientForm.email} onChange={handlePatientChange} required className={patientFormErrors.email ? 'error' : ''} />
                  {patientFormErrors.email && <span className="field-error">{patientFormErrors.email}</span>}
                </label>
                <label>
                  Phone
                  <input name="phone" value={patientForm.phone} onChange={handlePatientChange} required className={patientFormErrors.phone ? 'error' : ''} />
                  {patientFormErrors.phone && <span className="field-error">{patientFormErrors.phone}</span>}
                </label>
                <label>
                  Address (optional)
                  <input name="address" value={patientForm.address} onChange={handlePatientChange} placeholder="Optional" />
                </label>
                <button type="submit">Add patient</button>
              </form>
            </section>
            <section className="list-section">
              <h2>Patients</h2>
              {patientsError && <p className="error">{patientsError}</p>}
              {patientsLoading && <p className="muted">Loading…</p>}
              {!patientsLoading && !patientsError && patients.length === 0 && <p className="muted">No patients yet.</p>}
              {!patientsLoading && patients.length > 0 && (
                <ul className="appointment-list">
                  {patients.map((p) => (
                    <li key={p._id} className="appointment-card patient-card">
                      {patientEditingId === p._id ? (
                        <form className="edit-form" onSubmit={(e) => handlePatientEditSubmit(e, p._id)}>
                          <label>
                            Name
                            <input name="name" value={patientEditForm.name} onChange={handlePatientEditChange} required className={patientEditFormErrors.name ? 'error' : ''} />
                            {patientEditFormErrors.name && <span className="field-error">{patientEditFormErrors.name}</span>}
                          </label>
                          <label>
                            Email
                            <input name="email" type="email" value={patientEditForm.email} onChange={handlePatientEditChange} required className={patientEditFormErrors.email ? 'error' : ''} />
                            {patientEditFormErrors.email && <span className="field-error">{patientEditFormErrors.email}</span>}
                          </label>
                          <label>
                            Phone
                            <input name="phone" value={patientEditForm.phone} onChange={handlePatientEditChange} required className={patientEditFormErrors.phone ? 'error' : ''} />
                            {patientEditFormErrors.phone && <span className="field-error">{patientEditFormErrors.phone}</span>}
                          </label>
                          <label>
                            Address
                            <input name="address" value={patientEditForm.address} onChange={handlePatientEditChange} />
                          </label>
                          <div className="edit-actions">
                            <button type="submit">Save</button>
                            <button type="button" onClick={() => setPatientEditingId(null)}>Cancel</button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <span className="patient">{p.name}</span>
                          <span className="dentist">{p.email}</span>
                          <span className="datetime">{p.phone}</span>
                          {p.address && <span className="reason">{p.address}</span>}
                          <div className="card-actions">
                            <button type="button" className="btn-edit" onClick={() => handlePatientEditClick(p)}>Edit</button>
                            <button type="button" className="btn-delete" onClick={() => handlePatientDelete(p._id)}>Delete</button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}

        {view === 'dentists' && (
          <>
            <section className="form-section">
              <h2>New dentist</h2>
              <form onSubmit={handleDentistSubmit} className="form">
                <label>
                  Name
                  <input name="name" value={dentistForm.name} onChange={handleDentistChange} required className={dentistFormErrors.name ? 'error' : ''} />
                  {dentistFormErrors.name && <span className="field-error">{dentistFormErrors.name}</span>}
                </label>
                <label>
                  Specialization
                  <input name="specialization" value={dentistForm.specialization} onChange={handleDentistChange} required className={dentistFormErrors.specialization ? 'error' : ''} />
                  {dentistFormErrors.specialization && <span className="field-error">{dentistFormErrors.specialization}</span>}
                </label>
                <label>
                  Experience (years)
                  <input name="experience" type="number" min="0" value={dentistForm.experience} onChange={handleDentistChange} required className={dentistFormErrors.experience ? 'error' : ''} />
                  {dentistFormErrors.experience && <span className="field-error">{dentistFormErrors.experience}</span>}
                </label>
                <label>
                  Phone
                  <input name="phone" type="tel" value={dentistForm.phone} onChange={handleDentistChange} required className={dentistFormErrors.phone ? 'error' : ''} />
                  {dentistFormErrors.phone && <span className="field-error">{dentistFormErrors.phone}</span>}
                </label>
                <button type="submit">Add dentist</button>
              </form>
            </section>
            <section className="list-section">
              <h2>Dentists</h2>
              {dentistsError && <p className="error">{dentistsError}</p>}
              {dentistsLoading && <p className="muted">Loading…</p>}
              {!dentistsLoading && !dentistsError && dentists.length === 0 && <p className="muted">No dentists yet.</p>}
              {!dentistsLoading && dentists.length > 0 && (
                <ul className="appointment-list">
                  {dentists.map((d) => (
                    <li key={d._id} className="appointment-card dentist-card">
                      {dentistEditingId === d._id ? (
                        <form className="edit-form" onSubmit={(e) => handleDentistEditSubmit(e, d._id)}>
                          <label>
                            Name
                            <input name="name" value={dentistEditForm.name} onChange={handleDentistEditChange} required className={dentistEditFormErrors.name ? 'error' : ''} />
                            {dentistEditFormErrors.name && <span className="field-error">{dentistEditFormErrors.name}</span>}
                          </label>
                          <label>
                            Specialization
                            <input name="specialization" value={dentistEditForm.specialization} onChange={handleDentistEditChange} required className={dentistEditFormErrors.specialization ? 'error' : ''} />
                            {dentistEditFormErrors.specialization && <span className="field-error">{dentistEditFormErrors.specialization}</span>}
                          </label>
                          <label>
                            Experience (years)
                            <input name="experience" type="number" min="0" value={dentistEditForm.experience} onChange={handleDentistEditChange} required className={dentistEditFormErrors.experience ? 'error' : ''} />
                            {dentistEditFormErrors.experience && <span className="field-error">{dentistEditFormErrors.experience}</span>}
                          </label>
                          <label>
                            Phone
                            <input name="phone" type="tel" value={dentistEditForm.phone} onChange={handleDentistEditChange} required className={dentistEditFormErrors.phone ? 'error' : ''} />
                            {dentistEditFormErrors.phone && <span className="field-error">{dentistEditFormErrors.phone}</span>}
                          </label>
                          <div className="edit-actions">
                            <button type="submit">Save</button>
                            <button type="button" onClick={() => setDentistEditingId(null)}>Cancel</button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <span className="patient">{d.name}</span>
                          <span className="dentist">{d.specialization}</span>
                          <span className="datetime">{d.experience} years · {d.phone}</span>
                          <div className="card-actions">
                            <button type="button" className="btn-edit" onClick={() => handleDentistEditClick(d)}>Edit</button>
                            <button type="button" className="btn-delete" onClick={() => handleDentistDelete(d._id)}>Delete</button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
