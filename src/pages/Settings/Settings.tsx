import { useState } from 'react';
import { motion } from 'framer-motion';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { User } from 'firebase/auth';
import type { ChurchData } from '../../hooks/useChurchProfile';
import './Settings.css';

interface SettingsProps {
  user: User;
  church: ChurchData;
  onSave: () => void;
}

export function Settings({ user, church, onSave }: SettingsProps) {
  const [form, setForm] = useState({ ...church });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  function set(field: keyof ChurchData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!form.churchName.trim()) {
      setError('O nome da igreja é obrigatório.');
      return;
    }
    if (!form.city.trim()) {
      setError('A cidade é obrigatória.');
      return;
    }
    if (!form.pastor.trim()) {
      setError('O nome do pastor responsável é obrigatório.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await setDoc(doc(db, 'churches', user.uid), {
        ...form,
        churchName: form.churchName.trim(),
        city: form.city.trim(),
        pastor: form.pastor.trim(),
        phone: form.phone?.trim() || null,
        address: form.address?.trim() || null,
        logoUrl: form.logoUrl?.trim() || null,
        instagram: form.instagram?.trim() || null,
        youtube: form.youtube?.trim() || null,
        facebook: form.facebook?.trim() || null,
      });

      setSuccess(true);
      onSave();
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Erro ao salvar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="settings">
      <div className="settings__header">
        <h1 className="settings__title">Configurações</h1>
        <p className="settings__subtitle">Gerencie as informações da sua igreja</p>
      </div>

      <div className="settings__card">

        {error && (
          <motion.p
            className="settings__error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            {error}
          </motion.p>
        )}

        {success && (
          <motion.p
            className="settings__success"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            ✅ Perfil atualizado com sucesso!
          </motion.p>
        )}

        {/* Preview da logo */}
        <div className="settings__logo-preview">
          {form.logoUrl ? (
            <img
              src={form.logoUrl}
              alt="Logo da igreja"
              onError={e => (e.currentTarget.style.display = 'none')}
            />
          ) : (
            <div className="settings__logo-placeholder">✝</div>
          )}
          <div className="settings__logo-info">
            <strong>{form.churchName || 'Nome da Igreja'}</strong>
            <span>{form.city || 'Cidade'}</span>
          </div>
        </div>

        {/* Informações obrigatórias */}
        <div className="settings__section-title">Informações Obrigatórias</div>

        <div className="settings__field">
          <label>Nome da Igreja *</label>
          <input
            value={form.churchName}
            onChange={e => set('churchName', e.target.value)}
            placeholder="Ex: Igreja Batista Central"
          />
        </div>

        <div className="settings__row">
          <div className="settings__field">
            <label>Cidade *</label>
            <input
              value={form.city}
              onChange={e => set('city', e.target.value)}
              placeholder="Ex: São Paulo, SP"
            />
          </div>
          <div className="settings__field">
            <label>Pastor Responsável *</label>
            <input
              value={form.pastor}
              onChange={e => set('pastor', e.target.value)}
              placeholder="Ex: Pr. João Silva"
            />
          </div>
        </div>

        {/* Informações opcionais */}
        <div className="settings__section-title">Informações Opcionais</div>

        <div className="settings__row">
          <div className="settings__field">
            <label>Telefone da Igreja</label>
            <input
              value={form.phone || ''}
              onChange={e => set('phone', e.target.value)}
              placeholder="(00) 00000-0000"
            />
          </div>
          <div className="settings__field">
            <label>Endereço</label>
            <input
              value={form.address || ''}
              onChange={e => set('address', e.target.value)}
              placeholder="Rua, número, bairro"
            />
          </div>
        </div>

        <div className="settings__field">
          <label>URL da Logo da Igreja</label>
          <input
            value={form.logoUrl || ''}
            onChange={e => set('logoUrl', e.target.value)}
            placeholder="https://exemplo.com/logo.png"
          />
          <span className="settings__helper">
            Cole o link direto de uma imagem hospedada online
          </span>
        </div>

        {/* Redes sociais */}
        <div className="settings__section-title">Redes Sociais</div>

        <div className="settings__field">
          <label>📸 Instagram</label>
          <input
            value={form.instagram || ''}
            onChange={e => set('instagram', e.target.value)}
            placeholder="@suaigreja"
          />
        </div>

        <div className="settings__row">
          <div className="settings__field">
            <label>▶️ YouTube</label>
            <input
              value={form.youtube || ''}
              onChange={e => set('youtube', e.target.value)}
              placeholder="Canal do YouTube"
            />
          </div>
          <div className="settings__field">
            <label>📘 Facebook</label>
            <input
              value={form.facebook || ''}
              onChange={e => set('facebook', e.target.value)}
              placeholder="Página do Facebook"
            />
          </div>
        </div>

        {/* Informações da conta */}
        <div className="settings__section-title">Conta</div>

        <div className="settings__account">
          <div className="settings__account-avatar">
            {user.photoURL ? (
              <img src={user.photoURL} alt="Avatar" />
            ) : (
              <span>{user.email?.[0].toUpperCase()}</span>
            )}
          </div>
          <div>
            <strong>{user.displayName || 'Admin'}</strong>
            <span>{user.email}</span>
          </div>
        </div>

        <motion.button
          className="settings__save-btn"
          onClick={handleSave}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? <span className="settings__spinner" /> : 'Salvar alterações'}
        </motion.button>
      </div>
    </div>
  );
}