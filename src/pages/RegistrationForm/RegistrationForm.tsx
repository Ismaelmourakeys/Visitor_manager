import { useState } from 'react';
import { useLusterInput } from '../../hooks/useLusterInput';
import type { Visitor } from '../../types/visitor';
import type { ChurchData } from '../../hooks/useChurchProfile';
import './RegistrationForm.css';

interface RegistrationFormProps {
  onSubmit: (visitor: Visitor) => void;
  church: ChurchData;
}

// ── Máscara de telefone — formata conforme digita ──
function formatPhone(value: string): string {
  const nums = value.replace(/\D/g, '');
  if (nums.length === 0) return '';
  if (nums.length <= 2) return `+${nums}`;
  if (nums.length <= 4) return `+${nums.slice(0, 2)} (${nums.slice(2)}`;
  if (nums.length <= 9) return `+${nums.slice(0, 2)} (${nums.slice(2, 4)}) ${nums.slice(4)}`;
  if (nums.length <= 13) return `+${nums.slice(0, 2)} (${nums.slice(2, 4)}) ${nums.slice(4, 9)}-${nums.slice(9)}`;
  return `+${nums.slice(0, 2)} (${nums.slice(2, 4)}) ${nums.slice(4, 9)}-${nums.slice(9, 13)}`;
}

export function RegistrationForm({ onSubmit, church }: RegistrationFormProps) {
  // Campos nativos
  const [visitedTimes, setVisitedTimes] = useState('');
  const [visitDate] = useState(new Date().toISOString().split('T')[0]);
  const [phone, setPhone] = useState('+55 (11) '); // ← pré-preenchido

  // Campos Luster — lidos direto do shadow DOM no submit
  const fullName = useLusterInput();
  const position = useLusterInput();
  const howFound = useLusterInput();

  function handleClear() {
    fullName.clear();
    position.clear();
    howFound.clear();
    setVisitedTimes('');
    setPhone('+55 (11) '); // ← reseta pro padrão
  }

  async function handleSubmit() {
    const values = {
      fullName: fullName.getValue(),
      position: position.getValue(),
      howFound: howFound.getValue(),
      visitedTimes,
      visitDate,
      phone,
    };

    if (!values.fullName.trim()) {
      alert('Por favor, preencha o nome.');
      return;
    }
    if (!values.visitedTimes) {
      alert('Por favor, selecione quantas vezes visitou.');
      return;
    }
    if (values.fullName.length > 100) {
      alert('Nome deve ter no máximo 100 caracteres.');
      return;
    }
    if (values.howFound && values.howFound.length > 100) {
      alert('"Como conheceu a igreja?" deve ter no máximo 100 caracteres.');
      return;
    }
    if (values.position && values.position.length > 50) {
      alert('"Cargo" deve ter no máximo 50 caracteres.');
      return;
    }

    const newVisitor: Visitor = {
      id: crypto.randomUUID(),
      fullName: values.fullName.trim(),
      phone: values.phone.trim() || undefined,
      visitedTimes: values.visitedTimes || undefined,
      visitDate: values.visitDate,
      position: values.position.trim() || undefined,
      howFound: values.howFound || undefined,
      status: 'New',
    };

    // 🔌 BACKEND: substituir por fetch POST '/api/visitors'
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

          {/* Nome completo */}
          <luster-input
            ref={fullName.ref}
            label="Nome + Sobrenome / ou Nome do Grupo *"
            placeholder="ex: Maria Silva / Grupo Filhas do Rei"
          ></luster-input>

          {/* Telefone com máscara */}
          <div className="reg-form__field">
            <label className="reg-form__label">
              Telefone / WhatsApp (Opcional)
            </label>
            <input
              className="reg-form__input-native"
              placeholder="+55 (11) 00000-0000"
              value={phone}
              onChange={e => setPhone(formatPhone(e.target.value))}
              inputMode="numeric"
              maxLength={19}
            />
            <span className="reg-form__helper">
              DDI e DDD pré-preenchidos — altere se necessário
            </span>
          </div>

          {/* Email — plano futuro
          <div className="reg-form__field">
            <label className="reg-form__label">
              Endereço de Email (Opcional)
            </label>
            <input
              className="reg-form__input-native"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
            />
          </div>
          */}

          {/* Quantas vezes visitou + Data */}
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
                readOnly
              />
            </div>
          </div>

          {/* Cargo */}
          <luster-input
            ref={position.ref}
            label="Possui algum cargo? (Opcional)"
            placeholder="Ex. Presbítero, Líder de Ministério, etc."
          ></luster-input>

          {/* Como conheceu */}
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