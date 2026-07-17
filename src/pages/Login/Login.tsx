import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth, googleProvider } from '../../lib/firebase';
import './Login.css';

interface LoginProps {
  startWithRegister?: boolean;
}

export function Login({ startWithRegister = false }: LoginProps) {
  const [isRegistering, setIsRegistering] = useState(startWithRegister);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleEmailSubmit() {
    setError('');
    setLoading(true);
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      const messages: Record<string, string> = {
        'auth/user-not-found':       'Usuário não encontrado.',
        'auth/wrong-password':       'Senha incorreta.',
        'auth/email-already-in-use': 'Este email já está cadastrado.',
        'auth/weak-password':        'A senha deve ter pelo menos 6 caracteres.',
        'auth/invalid-email':        'Email inválido.',
        'auth/invalid-credential':   'Email ou senha incorretos.',
      };
      setError(messages[err.code] || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch {
      setError('Erro ao entrar com Google. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login">
      <div className="login__bg">
        <div className="login__bg-circle login__bg-circle--1" />
        <div className="login__bg-circle login__bg-circle--2" />
        <div className="login__bg-circle login__bg-circle--3" />
      </div>

      <motion.div
        className="login__card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <motion.div
          className="login__header"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="login__logo">✝</div>
          <h1 className="login__title">Visitor Manager</h1>
          <p className="login__subtitle">Gestão de visitantes para igrejas</p>
        </motion.div>

        <div className="login__body">
          <AnimatePresence mode="wait">
            <motion.h2
              key={isRegistering ? 'register' : 'login'}
              className="login__form-title"
              initial={{ opacity: 0, x: isRegistering ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRegistering ? -20 : 20 }}
              transition={{ duration: 0.25 }}
            >
              {isRegistering ? 'Criar conta' : 'Entrar'}
            </motion.h2>
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.p
                className="login__error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.div
            className="login__field"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="login__label">Email</label>
            <input
              className="login__input"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleEmailSubmit()}
            />
          </motion.div>

          <motion.div
            className="login__field"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <label className="login__label">Senha</label>
            <input
              className="login__input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleEmailSubmit()}
            />
          </motion.div>

          <motion.button
            className="login__btn-primary"
            onClick={handleEmailSubmit}
            disabled={loading}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? <span className="login__spinner" /> : isRegistering ? 'Criar conta' : 'Entrar'}
          </motion.button>

          <div className="login__divider"><span>ou</span></div>

          <motion.button
            className="login__btn-google"
            onClick={handleGoogle}
            disabled={loading}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Entrar com Google
          </motion.button>
        </div>

        <motion.div
          className="login__footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {isRegistering ? (
            <p>
              Já tem uma conta?{' '}
              <button className="login__toggle" onClick={() => { setIsRegistering(false); setError(''); }}>
                Entrar
              </button>
            </p>
          ) : (
            <p>
              Primeira vez aqui?{' '}
              <button className="login__toggle" onClick={() => { setIsRegistering(true); setError(''); }}>
                Criar conta
              </button>
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}