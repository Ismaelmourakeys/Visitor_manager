function App() {
  
  return (
    <div>
      <luster-input
        label="Nome"
        placeholder="Digite seu nome"
      ></luster-input>

      <luster-input
        label="Email"
        placeholder="you@example.com"
        type="email"
      ></luster-input>

      <luster-input
        label="Password"
        type="password"
        helper-text="At least 8 characters"
      ></luster-input>

      <luster-input
        label="Username"
        placeholder="Choose a username"
        Error
        error-message="Username is already taken"
      ></luster-input>
      
      <luster-button>
        Enviar
      </luster-button>
    </div>
  )
}

export default App