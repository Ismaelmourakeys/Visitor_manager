import { useState } from 'react';
import { motion } from 'framer-motion';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { User } from 'firebase/auth';
import './ChurchProfile.css';

interface ChurchProfileProps {
  user: User;
  onComplete: () => void;
}

interface ProfileForm {
  churchName: string;
  city: string;
  pastor: string;
  phone: string;
  address: string;
  logoUrl: string;
  instagram: string;
  youtube: string;
  facebook: string;
}

const emptyForm: ProfileForm = {
  churchName: '',
  city: '',
  pastor: '',
  phone: '',
  address: '',
  logoUrl: '',
  instagram: '',
  youtube: '',
  facebook: '',
};

export function ChurchProfile({ user, onComplete }: ChurchProfileProps) {
  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function set(field: keyof ProfileForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
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
      // Salva o perfil da igreja no Firestore
      await setDoc(doc(db, 'churches', user.uid), {
        churchName: form.churchName.trim(),
        city: form.city.trim(),
        pastor: form.pastor.trim(),
        phone: form.phone.trim() || null,
        address: form.address.trim() || null,
        logoUrl: form.logoUrl.trim() || null,
        instagram: form.instagram.trim() || null,
        youtube: form.youtube.trim() || null,
        facebook: form.facebook.trim() || null,
        createdAt: new Date().toISOString(),
        uid: user.uid,
      });

      onComplete();
    } catch (err) {
      setError('Erro ao salvar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="church-profile">
      <div className="church-profile__bg">
        <div className="church-profile__bg-circle church-profile__bg-circle--1" />
        <div className="church-profile__bg-circle church-profile__bg-circle--2" />
      </div>

      <motion.div
        className="church-profile__card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="church-profile__header">
          <div className="church-profile__logo">✝</div>
          <h1>Configure sua Igreja</h1>
          <p>Preencha as informações para personalizar o sistema</p>
        </div>

        <div className="church-profile__body">
          {error && (
            <motion.p
              className="church-profile__error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              {error}
            </motion.p>
          )}

          <div className="church-profile__section-title">
            Informações Obrigatórias
          </div>

          <div className="church-profile__field">
            <label>Nome da Igreja *</label>
            <input
              placeholder="Ex: Igreja Batista Central"
              value={form.churchName}
              onChange={e => set('churchName', e.target.value)}
            />
          </div>

          <div className="church-profile__row">
            <div className="church-profile__field">
              <label>Cidade *</label>
              <input
                placeholder="Ex: São Paulo, SP"
                value={form.city}
                onChange={e => set('city', e.target.value)}
              />
            </div>

            <div className="church-profile__field">
              <label>Pastor/Pastora Responsável *</label>
              <input
                placeholder="Ex: Pr. João Silva"
                value={form.pastor}
                onChange={e => set('pastor', e.target.value)}
              />
            </div>
          </div>

          <div className="church-profile__section-title">
            Informações Opcionais
          </div>

          <div className="church-profile__row">
            <div className="church-profile__field">
              <label>Telefone da Igreja</label>
              <input
                placeholder="(00) 00000-0000"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
              />
            </div>

            <div className="church-profile__field">
              <label>Endereço</label>
              <input
                placeholder="Rua, número, bairro"
                value={form.address}
                onChange={e => set('address', e.target.value)}
              />
            </div>
          </div>

          <div className="church-profile__field">
            <label>URL da Logo da Igreja</label>
            <input
              placeholder="https://exemplo.com/logo.png"
              value={form.logoUrl}
              onChange={e => set('logoUrl', e.target.value)}
            />

            <span className="church-profile__helper">
              Cole o link direto de uma imagem hospedada online
            </span>
          </div>

          {form.logoUrl && (
            <motion.div
              className="church-profile__logo-preview"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <img
                src={form.logoUrl}
                alt="Preview da logo"
                onError={e => (e.currentTarget.style.display = 'none')}
              />
              <span>Preview da logo</span>
            </motion.div>
          )}

          <div className="church-profile__section-title">
            Redes Sociais
          </div>

          <div className="church-profile__field">
            <label>📸 Instagram</label>
            <input
              placeholder="@suaigreja"
              value={form.instagram}
              onChange={e => set('instagram', e.target.value)}
            />
          </div>

          <div className="church-profile__row">
            <div className="church-profile__field">
              <label>▶️ YouTube</label>
              <input
                placeholder="Canal do YouTube"
                value={form.youtube}
                onChange={e => set('youtube', e.target.value)}
              />
            </div>

            <div className="church-profile__field">
              <label>📘 Facebook</label>
              <input
                placeholder="Página do Facebook"
                value={form.facebook}
                onChange={e => set('facebook', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="church-profile__footer">
          <motion.button
            className="church-profile__btn"
            onClick={handleSubmit}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? <span className="church-profile__spinner" /> : 'Salvar e continuar →'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}