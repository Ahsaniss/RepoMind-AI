import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🧠</div>
        <h1 className="login-title">RepoMind <span className="text-gradient">AI</span></h1>
        <p className="login-sub">Your repository. Your context. Your AI engineer.</p>
        <button
          id="login-github-btn"
          className="btn-github"
          onClick={() => navigate('/dashboard')}
        >
          <span>⊛</span> Continue with GitHub
        </button>
        <p className="login-note">
          By signing in you agree to the <a href="#">Terms of Service</a>.
        </p>
      </div>
    </div>
  );
}
