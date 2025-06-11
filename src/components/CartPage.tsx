
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar as CalendarIcon, Trash2, FileText, CreditCard } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface CartPageProps {
  onBack: () => void;
}

const CartPage = ({ onBack }: CartPageProps) => {
  const { 
    cartItems, 
    removeFromCart, 
    updateRentalPeriod, 
    updateSpecialRequirements, 
    getTotalCost,
    clearCart 
  } = useCart();

  const [researcherInfo, setResearcherInfo] = useState({
    name: '',
    institution: '',
    email: '',
    researchPurpose: '',
    credentials: ''
  });

  const handleDateSelect = (artifactId: number, field: 'startDate' | 'endDate', date: Date | undefined) => {
    if (!date) return;
    
    const item = cartItems.find(item => item.artifactId === artifactId);
    if (!item) return;

    const newPeriod = { ...item.rentalPeriod, [field]: date };
    updateRentalPeriod(artifactId, newPeriod);
  };

  const handleDurationChange = (artifactId: number, duration: 'daily' | 'weekly' | 'monthly') => {
    const item = cartItems.find(item => item.artifactId === artifactId);
    if (!item) return;

    const newPeriod = { ...item.rentalPeriod, duration };
    updateRentalPeriod(artifactId, newPeriod);
  };

  const handleSubmitRequest = () => {
    // This would integrate with payment system
    console.log('Research rental request:', { cartItems, researcherInfo, totalCost: getTotalCost() });
    alert('Solicitud de investigación enviada. El equipo de Museo AMANO se contactará con usted para coordinar los detalles.');
    clearCart();
    onBack();
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card shadow-sm">
          <div className="container mx-auto px-6 py-6">
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Volver al Catálogo
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Carrito de Investigación</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Su carrito de investigación está vacío.</p>
            <p className="text-sm text-muted-foreground mt-2">Explore el catálogo y agregue piezas para investigación académica.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Volver al Catálogo
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Carrito de Investigación</h1>
          <p className="text-muted-foreground">Gestione su solicitud de investigación académica</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Piezas Seleccionadas ({cartItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.artifactId} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.accessionNumber}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.artifactId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Fecha de Inicio</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {item.rentalPeriod.startDate ? 
                                format(item.rentalPeriod.startDate, 'PPP', { locale: es }) : 
                                'Seleccionar fecha'
                              }
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={item.rentalPeriod.startDate || undefined}
                              onSelect={(date) => handleDateSelect(item.artifactId, 'startDate', date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label>Fecha de Fin</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {item.rentalPeriod.endDate ? 
                                format(item.rentalPeriod.endDate, 'PPP', { locale: es }) : 
                                'Seleccionar fecha'
                              }
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={item.rentalPeriod.endDate || undefined}
                              onSelect={(date) => handleDateSelect(item.artifactId, 'endDate', date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label>Duración</Label>
                        <Select 
                          value={item.rentalPeriod.duration} 
                          onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                            handleDurationChange(item.artifactId, value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Diario - $75 USD</SelectItem>
                            <SelectItem value="weekly">Semanal - $450 USD</SelectItem>
                            <SelectItem value="monthly">Mensual - $1,500 USD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Requerimientos Especiales</Label>
                      <Textarea
                        placeholder="Fotografía, análisis microscópico, manipulación especial..."
                        value={item.specialRequirements}
                        onChange={(e) => updateSpecialRequirements(item.artifactId, e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t">
                      <Badge variant="secondary">
                        Costo Estimado: ${item.estimatedCost.toLocaleString()} USD
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Researcher Information & Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información del Investigador</CardTitle>
                <CardDescription>
                  Complete sus datos académicos para procesar la solicitud
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={researcherInfo.name}
                    onChange={(e) => setResearcherInfo(prev => ({...prev, name: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="institution">Institución</Label>
                  <Input
                    id="institution"
                    value={researcherInfo.institution}
                    onChange={(e) => setResearcherInfo(prev => ({...prev, institution: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Académico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={researcherInfo.email}
                    onChange={(e) => setResearcherInfo(prev => ({...prev, email: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="purpose">Propósito de Investigación</Label>
                  <Textarea
                    id="purpose"
                    value={researcherInfo.researchPurpose}
                    onChange={(e) => setResearcherInfo(prev => ({...prev, researchPurpose: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="credentials">Credenciales Académicas</Label>
                  <Textarea
                    id="credentials"
                    placeholder="Grado académico, publicaciones relevantes, experiencia..."
                    value={researcherInfo.credentials}
                    onChange={(e) => setResearcherInfo(prev => ({...prev, credentials: e.target.value}))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Resumen de Costos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.artifactId} className="flex justify-between text-sm">
                      <span>{item.title}</span>
                      <span>${item.estimatedCost.toLocaleString()} USD</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${getTotalCost().toLocaleString()} USD</span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4" 
                  onClick={handleSubmitRequest}
                  disabled={!researcherInfo.name || !researcherInfo.institution || !researcherInfo.email}
                >
                  Enviar Solicitud de Investigación
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  *Los costos finales pueden variar según requerimientos especiales
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartPage;
