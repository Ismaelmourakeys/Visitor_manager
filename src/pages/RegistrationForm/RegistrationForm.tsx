import { useState } from 'react';
import { useLusterInput } from '../../hooks/useLusterInput';
import type { Visitor } from '../../types/visitor';
import type { ChurchData } from '../../hooks/useChurchProfile';
import './RegistrationForm.css';

interface RegistrationFormProps {
  onSubmit: (visitor: Visitor) => void;
  church: ChurchData;
}

export function RegistrationForm({ onSubmit, church }: RegistrationFormProps) {
  const [visitedTimes, setVisitedTimes] = useState('');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);

  const fullName = useLusterInput();
  const phone = useLusterInput();
  const email = useLusterInput();
  const position = useLusterInput();
  const howFound = useLusterInput();

  function handleClear() {
    fullName.clear();
    phone.clear();
    email.clear();
    position.clear();
    howFound.clear();
    setVisitedTimes('');
    setVisitDate(new Date().toISOString().split('T')[0]);
  }

  async function handleSubmit() {
    const values = {
      fullName: fullName.getValue(),
      phone: phone.getValue(),
      email: email.getValue(),
      position: position.getValue(),
      howFound: howFound.getValue(),
      visitedTimes,
      visitDate,
    };

    if (!values.fullName.trim() || !values.visitedTimes) {
      alert('Por favor, preencha os campos obrigatórios: Nome e quantas vezes visitou.');
      return;
    }
    if (values.email && !/\S+@\S+\.\S+/.test(values.email)) {
      alert('Por favor, insira um endereço de email válido.');
      return;
    }
    if (values.phone && !/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(values.phone)) {
      alert('Por favor, insira um número de telefone válido.');
      return;
    }
    if (new Date(values.visitDate) > new Date()) {
      alert('A data da visita não pode ser no futuro.');
      return;
    }

    const newVisitor: Visitor = {
      id: crypto.randomUUID(),
      fullName: values.fullName.trim(),
      phone: values.phone.trim() || undefined,
      email: values.email.trim() || undefined,
      visitedTimes: values.visitedTimes || undefined,
      visitDate: values.visitDate,
      position: values.position.trim() || undefined,
      howFound: values.howFound || undefined,
      status: 'New',
    };

    onSubmit(newVisitor);
    handleClear();
    alert('Registro bem-sucedido! Seja bem-vindo à nossa igreja.');
  }

  return (
    <div className="reg-form">
      <div className="reg-form__card">
        <div className="reg-form__header">
          <h1 className="reg-form__title">Bem-vindo à {church.churchName}</h1>
          <p className="reg-form__subtitle">
            Estamos felizes que você esteja aqui! Por favor, preencha este breve
            formulário para que possamos conectar você conosco.
          </p>
        </div>

        <div className="reg-form__body">
          <luster-input
            ref={fullName.ref}
            label="Nome + Sobrenome / ou Nome do Grupo *"
            placeholder="ex: Maria Silva / Grupo Filhas do Rei"
          ></luster-input>

          <div className="reg-form__row">
            <luster-input
              ref={phone.ref}
              label="Telefone / WhatsApp (Opcional)"
              placeholder="(00) 00000-0000"
            ></luster-input>

            <luster-input
              ref={email.ref}
              label="Endereço de Email (Opcional)"
              placeholder="you@example.com"
              type="email"
            ></luster-input>
          </div>

          <div className="reg-form__row">
            <div className="reg-form__field">
              <label className="reg-form__label">
                Quantas vezes você já nos visitou? *
              </label>
              <select
                className="reg-form__select"
                value={visitedTimes}
                onChange={e => setVisitedTimes(e.target.value)}
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
                value={visitDate}
                onChange={e => setVisitDate(e.target.value)}
              />
            </div>
          </div>

          <luster-input
            ref={position.ref}
            label="Possui algum cargo? (Opcional)"
            placeholder="Ex. Presbítero, Líder de Ministério, etc."
          ></luster-input>

          <luster-input
            ref={howFound.ref}
            label="Como conheceu a igreja? (Opcional)"
            placeholder="Ex. Redes Sociais, Indicação de Amigo, etc."
            helper-text="Adoramos saber onde você nos conheceu."
          ></luster-input>
        </div>

        <div className="reg-form__actions">
          <button className="reg-form__clear-btn" onClick={handleClear}>
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