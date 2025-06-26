
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SignupFormProps {
  onError: (error: string) => void;
  onSuccess: (message: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const SignupForm = ({ onError, onSuccess, loading, setLoading }: SignupFormProps) => {
  const { signUp } = useAuth();
  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    institution: ''
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onError('');
    onSuccess('');

    if (signupForm.password !== signupForm.confirmPassword) {
      onError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    const { error } = await signUp(
      signupForm.email, 
      signupForm.password,
      {
        full_name: signupForm.fullName,
        institution: signupForm.institution
      }
    );
    
    if (error) {
      onError(error.message);
    } else {
      onSuccess('Se ha enviado un correo de confirmación. Por favor, revisa tu bandeja de entrada.');
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div>
        <Label htmlFor="signup-name">Nombre Completo</Label>
        <Input
          id="signup-name"
          value={signupForm.fullName}
          onChange={(e) => setSignupForm(prev => ({...prev, fullName: e.target.value}))}
          required
        />
      </div>
      <div>
        <Label htmlFor="signup-institution">Institución</Label>
        <Input
          id="signup-institution"
          value={signupForm.institution}
          onChange={(e) => setSignupForm(prev => ({...prev, institution: e.target.value}))}
        />
      </div>
      <div>
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          value={signupForm.email}
          onChange={(e) => setSignupForm(prev => ({...prev, email: e.target.value}))}
          required
        />
      </div>
      <div>
        <Label htmlFor="signup-password">Contraseña</Label>
        <Input
          id="signup-password"
          type="password"
          value={signupForm.password}
          onChange={(e) => setSignupForm(prev => ({...prev, password: e.target.value}))}
          required
        />
      </div>
      <div>
        <Label htmlFor="signup-confirm">Confirmar Contraseña</Label>
        <Input
          id="signup-confirm"
          type="password"
          value={signupForm.confirmPassword}
          onChange={(e) => setSignupForm(prev => ({...prev, confirmPassword: e.target.value}))}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Registrarse
      </Button>
    </form>
  );
};
