import { useState } from 'react';
import type { Visitor, HowFound } from '../../types/visitor';
import './RegistrationForm.css';

interface RegistrationFormProps {
  onSubmit: (visitor: Visitor) => void;
}

interface FormState {
  fullName: string;
  phone: string;
  email: string;
  howFound: HowFound | '';
  invitedBy: string;
  visitDate: string;
  favoriteHymn: string;
}

const emptyForm: FormState = {
  fullName: '',
  phone: '',
  email: '',
  howFound: '',
  invitedBy: '',
  visitDate: new Date().toISOString().split('T')[0],
  favoriteHymn: '',
};

export function RegistrationForm({ onSubmit }: RegistrationFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm);

  function set(field: keyof FormState, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleSubmit() {
    if (!form.fullName.trim() || !form.phone.trim() || !form.howFound) {
      alert('Please fill in the required fields: Full Name, Phone and How did you find us.');
      return;
    }

    const newVisitor: Visitor = {
      id: crypto.randomUUID(),
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
      howFound: form.howFound as HowFound,
      invitedBy: form.invitedBy.trim() || undefined,
      visitDate: form.visitDate,
      favoriteHymn: form.favoriteHymn.trim() || undefined,
      status: 'New',
    };

    onSubmit(newVisitor);
    setForm(emptyForm);
  }

  return (
    <div className="reg-form">
      <div className="reg-form__card">
        <div className="reg-form__header">
          <h1 className="reg-form__title">Welcome to Grace Church</h1>
          <p className="reg-form__subtitle">
            We're so glad you're here! Please fill out this brief form
            so we can connect with you.
          </p>
        </div>

        <div className="reg-form__body">
          {/* Nome completo */}
          <luster-input
            label="Full Name *"
            placeholder="ex: Maria Silva"
            value={form.fullName}
            onInput={(e: any) => set('fullName', e.target.value)}
          ></luster-input>

          {/* Telefone + Email */}
          <div className="reg-form__row">
            <luster-input
              label="Phone / WhatsApp *"
              placeholder="(00) 00000-0000"
              value={form.phone}
              onInput={(e: any) => set('phone', e.target.value)}
            ></luster-input>

            <luster-input
              label="Email Address (Optional)"
              placeholder="you@example.com"
              type="email"
              value={form.email}
              onInput={(e: any) => set('email', e.target.value)}
            ></luster-input>
          </div>

          {/* Como conheceu + Data */}
          <div className="reg-form__row">
            <div className="reg-form__field">
              <label className="reg-form__label">How did you find us? *</label>
              <select
                className="reg-form__select"
                value={form.howFound}
                onChange={e => set('howFound', e.target.value)}
              >
                <option value="">Select an option</option>
                <option value="Social Media">Social Media</option>
                <option value="Friend/Family">Friend / Family</option>
                <option value="Walked By">Walked By</option>
                <option value="Online Search">Online Search</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="reg-form__field">
              <label className="reg-form__label">Visit Date</label>
              <input
                className="reg-form__input-native"
                type="date"
                value={form.visitDate}
                onChange={e => set('visitDate', e.target.value)}
              />
            </div>
          </div>

          {/* Quem convidou */}
          <luster-input
            label="Who invited you? (Optional)"
            placeholder="Name of the person"
            value={form.invitedBy}
            onInput={(e: any) => set('invitedBy', e.target.value)}
          ></luster-input>

          {/* Hino favorito */}
          <luster-input
            label="Favorite Hymn / Worship Song (Optional)"
            placeholder="Name of the song"
            helper-text="We love knowing what music moves our community."
            value={form.favoriteHymn}
            onInput={(e: any) => set('favoriteHymn', e.target.value)}
          ></luster-input>
        </div>

        <div className="reg-form__actions">
          <button
            className="reg-form__clear-btn"
            onClick={() => setForm(emptyForm)}
          >
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
