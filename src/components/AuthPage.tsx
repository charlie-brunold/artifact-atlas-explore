
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

interface AuthPageProps {
  onBack: () => void;
}

const AuthPage = ({ onBack }: AuthPageProps) => {
  const { signIn, signUp } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    institution: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await signIn(loginForm.email, loginForm.password);
    
    if (error) {
      setError(error.message);
    }
    
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (signupForm.password !== signupForm.confirmPassword) {
      setError('Las contraseñas no coinciden');
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
      setError(error.message);
    } else {
      setSuccess('Se ha enviado un correo de confirmación. Por favor, revisa tu bandeja de entrada.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al Catálogo
        </Button>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Museo AMANO</CardTitle>
            <CardDescription>
              Accede a tu cuenta de investigador para gestionar tus colecciones y solicitudes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="signup">Registrarse</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({...prev, email: e.target.value}))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Contraseña</Label>
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
                    Iniciar Sesión
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
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
              </TabsContent>
            </Tabs>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mt-4">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
