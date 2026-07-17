import { useState, useCallback } from 'react';
import type { Visitor } from '../../types/visitor';
import { useLusterInput } from '../../hooks/useLusterInput';
import './RegistrationForm.css';

interface RegistrationFormProps {
  onSubmit: (visitor: Visitor) => void;
}

interface FormState {
  fullName: string;
  phone: string;
  email: string;
  visitedTimes: string;
  visitDate: string;
  position: string;
  howFound: string;
}

const emptyForm: FormState = {
  fullName: '',
  phone: '',
  email: '',
  visitedTimes: '',
  visitDate: new Date().toISOString().split('T')[0],
  position: '',
  howFound: '',
};

export function RegistrationForm({ onSubmit }: RegistrationFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm);

  function set(field: keyof FormState, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  // Refs para os luster-inputs — useCallback evita recriar a função a cada render
  const fullNameRef = useLusterInput(useCallback((v) => set('fullName', v), []));
  const phoneRef = useLusterInput(useCallback((v) => set('phone', v), []));
  const emailRef = useLusterInput(useCallback((v) => set('email', v), []));
  const positionRef = useLusterInput(useCallback((v) => set('position', v), []));
  const howFoundRef = useLusterInput(useCallback((v) => set('howFound', v), []));

  async function handleSubmit() {
    console.log('form atual:', form); // ← adiciona isso
    if (!form.fullName.trim() || !form.visitedTimes) {
      alert('Por favor, preencha os campos obrigatórios: Nome e quantas vezes visitou.');
      return;
    }
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      alert('Por favor, insira um endereço de email válido.');
      return;
    }
    if (form.phone && !/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(form.phone)) {
      alert('Por favor, insira um número de telefone válido (ex: (00) 00000-0000).');
      return;
    }
    if (new Date(form.visitDate) > new Date()) {
      alert('A data da visita não pode ser no futuro.');
      return;
    }
    if (form.fullName.length > 100) {
      alert('Nome deve ter no máximo 100 caracteres.');
      return;
    }
    if (form.howFound && form.howFound.length > 100) {
      alert('"Como conheceu a igreja?" deve ter no máximo 100 caracteres.');
      return;
    }
    if (form.position && form.position.length > 50) {
      alert('"Cargo" deve ter no máximo 50 caracteres.');
      return;
    }

    const newVisitor: Visitor = {
      id: crypto.randomUUID(),
      fullName: form.fullName.trim(),
      phone: form.phone.trim() || undefined,
      email: form.email.trim() || undefined,
      visitedTimes: form.visitedTimes || undefined,
      visitDate: form.visitDate,
      position: form.position.trim() || undefined,
      howFound: form.howFound || undefined,
      status: 'New',
    };

    // 🔌 BACKEND: substituir por fetch POST '/api/visitors'
    onSubmit(newVisitor);
    setForm(emptyForm);
    alert('Registro bem-sucedido! Seja bem-vindo à nossa igreja.');
  }

  return (
    <div className="reg-form">
      <div className="reg-form__card">
        <div className="reg-form__header">
          <h1 className="reg-form__title">Bem-vindo à Grace Church</h1>
          <p className="reg-form__subtitle">
            Estamos felizes que você esteja aqui! Por favor, preencha este breve
            formulário para que possamos conectar você conosco.
          </p>
        </div>

        <div className="reg-form__body">
          <luster-input
            ref={fullNameRef}
            label="Nome + Sobrenome / ou Nome do Grupo *"
            placeholder="ex: Maria Silva / Grupo Filhas do Rei"
            value={form.fullName}
          ></luster-input>

          <div className="reg-form__row">
            <luster-input
              ref={phoneRef}
              label="Telefone / WhatsApp (Opcional)"
              placeholder="(00) 00000-0000"
              value={form.phone}
            ></luster-input>

            <luster-input
              ref={emailRef}
              label="Endereço de Email (Opcional)"
              placeholder="you@example.com"
              type="email"
              value={form.email}
            ></luster-input>
          </div>

          <div className="reg-form__row">
            <div className="reg-form__field">
              <label className="reg-form__label">
                Quantas vezes você já nos visitou? *
              </label>
              <select
                className="reg-form__select"
                value={form.visitedTimes}
                onChange={e => set('visitedTimes', e.target.value)}
              >
                <option value="">Selecione uma opção</option>
                <option value="1 vez">1 vez</option>
                <option value="2 vezes">2 vezes</option>
                <option value="3 vezes ou mais">3 vezes ou mais</option>
              </select>
            </div>

            <div className="reg-form__field">
              <label className="reg-form__label">Data da Visita</label>
              <input
                className="reg-form__input-native"
                type="date"
                value={form.visitDate}
                onChange={e => set('visitDate', e.target.value)}
              />
            </div>
          </div>

          <luster-input
            ref={positionRef}
            label="Possui algum cargo? (Opcional)"
            placeholder="Ex. Presbítero, Líder de Ministério, etc."
            value={form.position}
          ></luster-input>

          <luster-input
            ref={howFoundRef}
            label="Como conheceu a igreja? (Opcional)"
            placeholder="Ex. Redes Sociais, Indicação de Amigo, etc."
            helper-text="Adoramos saber onde você nos conheceu."
            value={form.howFound}
          ></luster-input>
        </div>

        <div className="reg-form__actions">
          <button
            className="reg-form__clear-btn"
            onClick={() => setForm(emptyForm)}
          >
            Limpar
          </button>
          <button className="reg-form__submit-btn" onClick={handleSubmit}>
            Registrar →
          </button>
        </div>
      </div>
    </div>
  );
}