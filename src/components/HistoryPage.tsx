
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { History, FileText, ExternalLink } from 'lucide-react';

const HistoryPage = () => {
  // Placeholder data - will be connected to real data later
  const mockHistory = [
    {
      id: 1,
      artifacts: ['Vaso ceremonial', 'Textil ritual'],
      totalCost: 890,
      status: 'completed',
      date: '2024-01-15',
      duration: '2 semanas'
    },
    {
      id: 2,
      artifacts: ['Máscara funeraria'],
      totalCost: 450,
      status: 'pending',
      date: '2024-02-20',
      duration: '1 semana'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <History className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Historial de Solicitudes</h1>
            <p className="text-muted-foreground">
              Revisa todas tus solicitudes de alquiler de artefactos
            </p>
          </div>
        </div>

        {mockHistory.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No tienes solicitudes previas</h3>
              <p className="text-muted-foreground mb-4">
                Cuando realices solicitudes de alquiler, aparecerán aquí
              </p>
              <Button variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                Explorar Catálogo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Summary Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Actividad</CardTitle>
                <CardDescription>
                  Estadísticas de tus solicitudes de investigación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{mockHistory.length}</p>
                    <p className="text-sm text-muted-foreground">Total Solicitudes</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {mockHistory.filter(h => h.status === 'completed').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Completadas</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">
                      {mockHistory.filter(h => h.status === 'pending').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Pendientes</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">
                      ${mockHistory.reduce((sum, h) => sum + h.totalCost, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Invertido</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* History List */}
            <div className="space-y-4">
              {mockHistory.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-medium">
                            Solicitud #{request.id}
                          </h3>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusText(request.status)}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <p className="text-sm">
                            <span className="font-medium">Artefactos:</span>{' '}
                            {request.artifacts.join(', ')}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Duración:</span> {request.duration}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Costo total:</span> ${request.totalCost}
                          </p>
                        </div>
                        
                        <p className="text-xs text-muted-foreground">
                          Solicitado el {new Date(request.date).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </Button>
                        {request.status === 'completed' && (
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Descargar Recibo
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
