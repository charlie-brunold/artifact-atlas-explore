
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCollections } from '@/hooks/useCollections';
import { useToast } from '@/hooks/use-toast';
import { BookMarked, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const CollectionsPage = () => {
  const { collections, loading, removeFromCollection } = useCollections();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleRemoveItem = async (artifactId: number, title: string) => {
    setDeletingId(artifactId.toString());
    const { error } = await removeFromCollection(artifactId);
    
    if (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el elemento de la colección",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Elemento eliminado",
        description: `"${title}" ha sido eliminado de tu colección`,
      });
    }
    setDeletingId(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <BookMarked className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Mis Colecciones</h1>
            <p className="text-muted-foreground">
              Gestiona tus artefactos guardados y colecciones personalizadas
            </p>
          </div>
        </div>

        {collections.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookMarked className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No tienes elementos guardados</h3>
              <p className="text-muted-foreground mb-4">
                Comienza explorando el catálogo y guarda artefactos que te interesen
              </p>
              <Button variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                Explorar Catálogo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Collection Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Colecciones</CardTitle>
                <CardDescription>
                  Un vistazo rápido a tus elementos guardados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{collections.length}</p>
                    <p className="text-sm text-muted-foreground">Total de Elementos</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">
                      {new Set(collections.map(c => c.collection_name)).size}
                    </p>
                    <p className="text-sm text-muted-foreground">Colecciones</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">
                      {collections.filter(c => c.notes && c.notes.trim()).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Con Notas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Collections List */}
            <div className="space-y-4">
              {collections.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-medium">{item.artifact_title}</h3>
                          <Badge variant="secondary">{item.collection_name}</Badge>
                        </div>
                        
                        {item.artifact_accession_number && (
                          <p className="text-sm text-muted-foreground mb-2">
                            Número de Accesión: {item.artifact_accession_number}
                          </p>
                        )}
                        
                        {item.notes && (
                          <div className="bg-muted/50 p-3 rounded-md mb-3">
                            <p className="text-sm font-medium mb-1">Notas:</p>
                            <p className="text-sm">{item.notes}</p>
                          </div>
                        )}
                        
                        <p className="text-xs text-muted-foreground">
                          Guardado el {new Date(item.created_at).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Ver Detalle
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              disabled={deletingId === item.artifact_id.toString()}
                            >
                              {deletingId === item.artifact_id.toString() ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar de la colección?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción eliminará "{item.artifact_title}" de tu colección. 
                                Esta acción no se puede deshacer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRemoveItem(item.artifact_id, item.artifact_title)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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

export default CollectionsPage;
