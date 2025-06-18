
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { BookmarkCheck, Search, Clock, Trash2, Eye } from 'lucide-react';
import Logo from '@/components/Logo';
import ArtifactCard from '@/components/ArtifactCard';
import { mockArtifacts } from '@/pages/Index';

interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: {
    cultures: string[];
    materials: string[];
    conditions: string[];
    periodRange: { start: number; end: number };
    tagLogic: 'OR' | 'AND';
  };
  createdAt: Date;
}

interface RecentlyViewed {
  artifactId: number;
  viewedAt: Date;
}

const MyCollection = () => {
  const [bookmarkedArtifacts, setBookmarkedArtifacts] = useState<typeof mockArtifacts>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<typeof mockArtifacts>([]);
  const [selectedArtifact, setSelectedArtifact] = useState<any>(null);

  useEffect(() => {
    // Load bookmarked artifacts
    const bookmarks = JSON.parse(localStorage.getItem('artifact-bookmarks') || '[]');
    const bookmarkedItems = mockArtifacts.filter(artifact => bookmarks.includes(artifact.id));
    setBookmarkedArtifacts(bookmarkedItems);

    // Load saved searches
    const searches = JSON.parse(localStorage.getItem('saved-searches') || '[]');
    setSavedSearches(searches.map((search: any) => ({
      ...search,
      createdAt: new Date(search.createdAt)
    })));

    // Load recently viewed
    const recentIds: RecentlyViewed[] = JSON.parse(localStorage.getItem('recently-viewed') || '[]');
    const recentArtifacts = recentIds
      .sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime())
      .slice(0, 12)
      .map(item => mockArtifacts.find(artifact => artifact.id === item.artifactId))
      .filter(Boolean) as typeof mockArtifacts;
    setRecentlyViewed(recentArtifacts);
  }, []);

  const handleDeleteSavedSearch = (searchId: string) => {
    const updatedSearches = savedSearches.filter(search => search.id !== searchId);
    setSavedSearches(updatedSearches);
    localStorage.setItem('saved-searches', JSON.stringify(updatedSearches));
  };

  const handleApplySavedSearch = (search: SavedSearch) => {
    // Navigate back to main page with applied filters
    const params = new URLSearchParams();
    params.set('q', search.query);
    params.set('cultures', search.filters.cultures.join(','));
    params.set('materials', search.filters.materials.join(','));
    params.set('conditions', search.filters.conditions.join(','));
    params.set('periodStart', search.filters.periodRange.start.toString());
    params.set('periodEnd', search.filters.periodRange.end.toString());
    params.set('tagLogic', search.filters.tagLogic);
    
    window.location.href = `/?" + ${params.toString()}`;
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    localStorage.removeItem('recently-viewed');
  };

  if (selectedArtifact) {
    return (
      <div>
        {/* Artifact detail view would go here - using existing ArtifactDetail component */}
        <Button onClick={() => setSelectedArtifact(null)} className="mb-4">
          ← Volver a Mi Colección
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <Logo />
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              ← Volver al Catálogo
            </Button>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Mi Colección</h1>
            <p className="text-muted-foreground">Gestiona tus artefactos guardados, búsquedas y actividad reciente</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="bookmarks" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bookmarks" className="flex items-center gap-2">
              <BookmarkCheck className="h-4 w-4" />
              Marcadores ({bookmarkedArtifacts.length})
            </TabsTrigger>
            <TabsTrigger value="searches" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Búsquedas Guardadas ({savedSearches.length})
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Vistos Recientemente ({recentlyViewed.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookmarks" className="mt-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Artefactos Guardados</h2>
              <p className="text-muted-foreground">
                Artefactos que has marcado para referencia futura
              </p>
            </div>
            
            {bookmarkedArtifacts.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookmarkCheck className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No hay artefactos guardados</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Marca artefactos usando el ícono de marcador para verlos aquí
                  </p>
                  <Button onClick={() => window.location.href = '/'}>
                    Explorar Catálogo
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarkedArtifacts.map((artifact) => (
                  <ArtifactCard
                    key={artifact.id}
                    artifact={artifact}
                    viewMode="grid"
                    onClick={() => setSelectedArtifact(artifact)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="searches" className="mt-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Búsquedas Guardadas</h2>
              <p className="text-muted-foreground">
                Consultas y filtros que has guardado para uso futuro
              </p>
            </div>

            {savedSearches.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No hay búsquedas guardadas</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Guarda búsquedas usando el botón "Guardar Búsqueda" en los filtros avanzados
                  </p>
                  <Button onClick={() => window.location.href = '/'}>
                    Crear Nueva Búsqueda
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {savedSearches.map((search) => (
                  <Card key={search.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{search.name}</CardTitle>
                          <CardDescription>
                            Guardada el {search.createdAt.toLocaleDateString('es-PE')}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleApplySavedSearch(search)}
                            size="sm"
                          >
                            Aplicar Búsqueda
                          </Button>
                          <Button
                            onClick={() => handleDeleteSavedSearch(search.id)}
                            size="sm"
                            variant="outline"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {search.query && (
                          <div>
                            <span className="text-sm font-medium">Consulta: </span>
                            <Badge variant="secondary">{search.query}</Badge>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {search.filters.cultures.length > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="text-sm text-muted-foreground">Culturas:</span>
                              {search.filters.cultures.map(culture => (
                                <Badge key={culture} variant="outline" className="text-xs">
                                  {culture}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {search.filters.materials.length > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="text-sm text-muted-foreground">Materiales:</span>
                              {search.filters.materials.map(material => (
                                <Badge key={material} variant="outline" className="text-xs">
                                  {material}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recent" className="mt-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">Vistos Recientemente</h2>
                <p className="text-muted-foreground">
                  Artefactos que has visualizado en las últimas sesiones
                </p>
              </div>
              {recentlyViewed.length > 0 && (
                <Button
                  onClick={clearRecentlyViewed}
                  variant="outline"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpiar Historial
                </Button>
              )}
            </div>

            {recentlyViewed.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Eye className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No hay artefactos recientes</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Los artefactos que visualices aparecerán aquí
                  </p>
                  <Button onClick={() => window.location.href = '/'}>
                    Explorar Catálogo
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentlyViewed.map((artifact) => (
                  <ArtifactCard
                    key={artifact.id}
                    artifact={artifact}
                    viewMode="grid"
                    onClick={() => setSelectedArtifact(artifact)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MyCollection;
