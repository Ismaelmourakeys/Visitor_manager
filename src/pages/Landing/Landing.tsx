import { motion } from 'framer-motion';
import './Landing.css';

interface LandingProps {
    onLogin: () => void;
    onRegister: () => void;
}

export function Landing({ onLogin, onRegister }: LandingProps) {
    return (
        <div className="landing">
            {/* Fundo animado */}
            <div className="landing__bg">
                <div className="landing__bg-circle landing__bg-circle--1" />
                <div className="landing__bg-circle landing__bg-circle--2" />
                <div className="landing__bg-circle landing__bg-circle--3" />
            </div>

            {/* Header */}
            <header className="landing__header">
                <div className="landing__logo-wrap">
                    <div className="landing__logo">✝</div>
                    <span className="landing__brand">Visitor Manager</span>
                </div>
                <div className="landing__header-actions">
                    <button className="landing__btn-ghost" onClick={onLogin}>
                        Entrar
                    </button>
                    <button className="landing__btn-primary" onClick={onRegister}>
                        Criar conta
                    </button>
                </div>
            </header>

            {/* Hero */}
            <main className="landing__main">
                <motion.div
                    className="landing__hero"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <motion.span
                        className="landing__tag"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        🙏 Sistema gratuito para igrejas
                    </motion.span>

                    <motion.h1
                        className="landing__title"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        Gerencie seus visitantes<br />
                        <span className="landing__title-highlight">com simplicidade</span>
                    </motion.h1>

                    <motion.p
                        className="landing__subtitle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        Cadastre visitantes, acompanhe presenças, exiba nomes no telão
                        e nunca perca o contato com quem visita sua igreja.
                    </motion.p>

                    <motion.div
                        className="landing__cta"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <button className="landing__btn-cta" onClick={onRegister}>
                            Começar agora — é grátis →
                        </button>
                        <button className="landing__btn-secondary" onClick={onLogin}>
                            Já tenho uma conta
                        </button>
                    </motion.div>

                    <motion.p
                        className="landing__disclaimer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        ⚠️ Para usar o sistema é necessário criar uma conta para sua igreja.
                        Cada igreja tem seu próprio acesso e dados separados.
                    </motion.p>
                </motion.div>

                {/* Cards de funcionalidades */}
                <motion.div
                    className="landing__features"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                >
                    {[
                        {
                            icon: '📋',
                            title: 'Cadastro fácil',
                            desc: 'Formulário simples e rápido para registrar visitantes durante o culto.',
                        },
                        {
                            icon: '📺',
                            title: 'Modo Telão',
                            desc: 'Exiba os nomes dos visitantes do dia na TV ou projetor da igreja.',
                        },
                        {
                            icon: '🔔',
                            title: 'Notificações',
                            desc: 'Receba alertas em tempo real quando um novo visitante for cadastrado.',
                        },
                        {
                            icon: '📊',
                            title: 'Painel completo',
                            desc: 'Filtre por data, cargo e frequência. Veja detalhes de cada visitante.',
                        },
                        {
                            icon: '⚙️',
                            title: 'Perfil da igreja',
                            desc: 'Personalize com o nome, logo, cidade e redes sociais da sua igreja.',
                        },
                        {
                            icon: '🔒',
                            title: 'Dados seguros',
                            desc: 'Cada igreja acessa apenas seus próprios dados. Nenhum cruzamento.',
                        },
                    ].map((f, i) => (
                        <motion.div
                            key={f.title}
                            className="landing__feature-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + i * 0.08 }}
                        >
                            <span className="landing__feature-icon">{f.icon}</span>
                            <strong>{f.title}</strong>
                            <p>{f.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="landing__footer">
                <p>Visitor Manager — Feito com 🤍 para igrejas</p>
                <div className="landing__footer-actions">
                    <button className="landing__btn-ghost-sm" onClick={onLogin}>Entrar</button>
                    <button className="landing__btn-primary-sm" onClick={onRegister}>Criar conta</button>
                </div>
            </footer>
        </div>
    );
}