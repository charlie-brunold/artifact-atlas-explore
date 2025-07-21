
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';

interface LoginFormProps {
  onError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const LoginForm = ({ onError, loading, setLoading }: LoginFormProps) => {
  const { signIn } = useAuth();
  const { t } = useTranslation();
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onError('');

    const { error } = await signIn(loginForm.email, loginForm.password);
    
    if (error) {
      onError(error.message);
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <Label htmlFor="login-email">{t('auth.email')}</Label>
        <Input
          id="login-email"
          type="email"
          value={loginForm.email}
          onChange={(e) => setLoginForm(prev => ({...prev, email: e.target.value}))}
          required
        />
      </div>
      <div>
        <Label htmlFor="login-password">{t('auth.password')}</Label>
        <Input
          id="login-password"
          type="password"
          value={loginForm.password}
          onChange={(e) => setLoginForm(prev => ({...prev, password: e.target.value}))}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {t('auth.signIn')}
      </Button>
    </form>
  );
};
