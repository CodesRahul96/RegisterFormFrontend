import { Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import OAuthCallback from './components/OAuthCallback';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/callback/:provider" element={<OAuthCallback />} />
        <Route path="/" element={<LoginForm />} />
      </Routes>
    </div>
  );
}

export default App;