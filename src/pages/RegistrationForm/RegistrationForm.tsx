// RegistrationForm.tsx
import { useState } from 'react';
import type { HowFound } from '../../types/visitor';
import './RegistrationForm.css';

export function RegistrationForm() {
    const [form, setForm] = useState({
        fullName: '',
        phone: '',
        email: '',
        howFound: '' as HowFound,
        invitedBy: '',
        visitDate: new Date().toISOString().split('T')[0],
        favoriteHymn: '',
    });

    function handleChange(field: string, value: string) {
        setForm(prev => ({ ...prev, [field]: value }));
    }

    function handleSubmit() {
        console.log('Visitante registrado:', form);
        // Futuramente: salvar no backend
        alert(`Visita de ${form.fullName} registrada!`);
    }

    function handleClear() {
        setForm({
            fullName: '', phone: '', email: '',
            howFound: '' as HowFound, invitedBy: '',
            visitDate: new Date().toISOString().split('T')[0],
            favoriteHymn: '',
        });
    }

    return (
        <div className="form-wrapper">
            <div className="form-card">
                <h1>Welcome to Grace Church</h1>
                <p>We're so glad you're here! Please fill out this brief form.</p>

                <div className="form-body">
                    {/* Nome */}
                    <luster-input
                        label="Full Name *"
                        placeholder="ex: Maria Silva"
                        value={form.fullName}
                        onInput={(e: any) => handleChange('fullName', e.target.value)}
                    ></luster-input>

                    {/* Telefone + Email na mesma linha */}
                    <div className="form-row">
                        <luster-input
                            label="Phone / WhatsApp *"
                            placeholder="(00) 00000-0000"
                            value={form.phone}
                            onInput={(e: any) => handleChange('phone', e.target.value)}
                        ></luster-input>

                        <luster-input
                            label="Email Address (Optional)"
                            placeholder="you@example.com"
                            type="email"
                            value={form.email}
                            onInput={(e: any) => handleChange('email', e.target.value)}
                        ></luster-input>
                    </div>

                    {/* Como conheceu + Data na mesma linha */}
                    <div className="form-row">
                        <div className="form-field">
                            <label>How did you find us? *</label>
                            <select
                                value={form.howFound}
                                onChange={e => handleChange('howFound', e.target.value)}
                            >
                                <option value="">Select an option</option>
                                <option value="Social Media">Social Media</option>
                                <option value="Friend/Family">Friend / Family</option>
                                <option value="Walked By">Walked By</option>
                                <option value="Online Search">Online Search</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <luster-input
                            label="Visit Date"
                            type="date"
                            value={form.visitDate}
                            onInput={(e: any) => handleChange('visitDate', e.target.value)}
                        ></luster-input>
                    </div>

                    {/* Quem convidou */}
                    <luster-input
                        label="Who invited you? (Optional)"
                        placeholder="Name of the person"
                        value={form.invitedBy}
                        onInput={(e: any) => handleChange('invitedBy', e.target.value)}
                    ></luster-input>

                    {/* Hino favorito */}
                    <luster-input
                        label="Favorite Hymn / Worship Song (Optional)"
                        placeholder="Name of the song"
                        helper-text="We love knowing what music moves our community."
                        value={form.favoriteHymn}
                        onInput={(e: any) => handleChange('favoriteHymn', e.target.value)}
                    ></luster-input>
                </div>

                {/* Ações */}
                <div className="form-actions">
                    <button className="btn-clear" onClick={handleClear}>
                        Clear Form
                    </button>
                    <luster-button onClick={handleSubmit}>
                        Register Visit →
                    </luster-button>
                </div>
            </div>
        </div>
    );
}