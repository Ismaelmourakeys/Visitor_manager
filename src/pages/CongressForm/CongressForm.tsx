import { useState } from 'react';
import { useLusterInput } from '../../hooks/useLusterInput';
import type { Congress, CongressType } from '../../types/congress';
import './CongressForm.css';

interface CongressFormProps {
  onSubmit: (congress: Omit<Congress, 'id'>) => void;
}

const CONGRESS_TYPES: CongressType[] = [
  'Irmãs', 'Mocidade', 'Varões',
  'Adolescentes', 'Crianças', 'Culto Eventual', 'Outro',
];

export function CongressForm({ onSubmit }: CongressFormProps) {
  const [congressType, setCongressType] = useState<CongressType | ''>('');
  const [date] = useState(new Date().toISOString().split('T')[0]);

  const churchName = useLusterInput();
  const groupName  = useLusterInput();
  const leaders    = useLusterInput();
  const pastors    = useLusterInput();
  const worship    = useLusterInput();

  function handleClear() {
    churchName.clear();
    groupName.clear();
    leaders.clear();
    pastors.clear();
    worship.clear();
    setCongressType('');
  }

  async function handleSubmit() {
    const values = {
      churchName:  churchName.getValue(),
      groupName:   groupName.getValue(),
      leaders:     leaders.getValue(),
      pastors:     pastors.getValue(),
      worship:     worship.getValue(),
    };

    if (!values.churchName.trim()) {
      alert('Por favor, informe o nome da igreja.');
      return;
    }
    if (!values.groupName.trim()) {
      alert('Por favor, informe o nome do grupo.');
      return;
    }
    if (!congressType) {
      alert('Por favor, selecione o tipo de congresso.');
      return;
    }

    const newCongress: Omit<Congress, 'id'> = {
      churchName:   values.churchName.trim(),
      groupName:    values.groupName.trim(),
      leaders:      values.leaders.trim() || undefined,
      pastors:      values.pastors.trim() || undefined,
      worship:      values.worship.trim() || undefined,
      congressType: congressType as CongressType,
      date,
    };

    onSubmit(newCongress);
    handleClear();
    alert('Grupo registrado com sucesso!');
  }

  return (
    <div className="congress-form">
      <div className="congress-form__card">
        <div className="congress-form__header">
          <h1 className="congress-form__title">Cadastro de Grupos</h1>
          <p className="congress-form__subtitle">
            Registre igrejas e grupos presentes no congresso.
          </p>
        </div>

        <div className="congress-form__body">
          {/* Tipo de congresso */}
          <div className="congress-form__field">
            <label className="congress-form__label">Tipo de Congresso *</label>
            <select
              className="congress-form__select"
              value={congressType}
              onChange={e => setCongressType(e.target.value as CongressType)}
            >
              <option value="">Selecione o tipo</option>
              {CONGRESS_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Nome da Igreja + Grupo */}
          <div className="congress-form__row">
            <luster-input
              ref={churchName.ref}
              label="Nome da Igreja *"
              placeholder="ex: Igreja Batista Central"
            ></luster-input>

            <luster-input
              ref={groupName.ref}
              label="Nome do Grupo *"
              placeholder="ex: Grupo Filhas do Rei"
            ></luster-input>
          </div>

          {/* Líderes + Pastores */}
          <div className="congress-form__row">
            <luster-input
              ref={leaders.ref}
              label="Nome dos Líderes (Opcional)"
              placeholder="ex: João e Maria Silva"
            ></luster-input>

            <luster-input
              ref={pastors.ref}
              label="Nome dos Pastores (Opcional)"
              placeholder="ex: Pr. Carlos Santos"
            ></luster-input>
          </div>

          {/* Louvor */}
          <luster-input
            ref={worship.ref}
            label="Louvor que irão ministrar (Opcional)"
            placeholder="ex: Casa do Pai — Fernandinho"
            helper-text="Informe a música ou o cantor que o grupo vai louvar."
          ></luster-input>

          {/* Data */}
          <div className="congress-form__field">
            <label className="congress-form__label">Data</label>
            <input
              className="congress-form__input-native"
              type="date"
              value={date}
              readOnly
            />
          </div>
        </div>

        <div className="congress-form__actions">
          <button className="congress-form__clear-btn" onClick={handleClear}>
            Limpar
          </button>
          <button className="congress-form__submit-btn" onClick={handleSubmit}>
            Registrar Grupo →
          </button>
        </div>
      </div>
    </div>
  );
}