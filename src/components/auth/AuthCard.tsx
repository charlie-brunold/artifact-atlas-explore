
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

interface AuthCardProps {
  error: string | null;
  success: string | null;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  setSuccess: (success: string) => void;
}

export const AuthCard = ({ 
  error, 
  success, 
  loading, 
  setLoading, 
  setError, 
  setSuccess 
}: AuthCardProps) => {
  return (
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
            <LoginForm 
              onError={setError}
              loading={loading}
              setLoading={setLoading}
            />
          </TabsContent>

          <TabsContent value="signup">
            <SignupForm 
              onError={setError}
              onSuccess={setSuccess}
              loading={loading}
              setLoading={setLoading}
            />
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
  );
};
