import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Wallet, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      const res = await authService.login({ email, password });
      
      // Update global context & local storage
      login(
        { _id: res._id, name: res.name, email: res.email },
        res.accessToken
      );
      
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err: any) {
      // Error toast is handled globally in API interceptor, but we catch here to stop loading state
      console.error('Login failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex grid md:grid-cols-2">
      {/* Left side — branding (hidden on mobile) */}
      <div className="hidden md:flex flex-col justify-center px-12 lg:px-24 bg-surface border-r border-border relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
        
        <div className="relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-8 shadow-glow">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Master your money. <br />
            <span className="text-primary-light">Predict your future.</span>
          </h1>
          <p className="text-lg text-text-muted max-w-md">
            SmartExpense is not just a ledger. It uses advanced mathematical velocity tracking to alert you before you break your budget.
          </p>
        </div>
      </div>

      {/* Right side — form */}
      <div className="flex w-full items-center justify-center p-6 sm:p-12">
        <div className="card w-full max-w-md animate-fade-in relative z-10">
          <div className="md:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-glow">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-text-primary">SmartExpense</span>
          </div>

          <h2 className="text-2xl font-bold text-text-primary mb-2">Welcome Back</h2>
          <p className="text-text-muted mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  type="email"
                  className="input-field pl-11"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  type="password"
                  className="input-field pl-11"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex justify-center items-center gap-2 mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-text-muted mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:text-primary-light font-medium transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
