import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCollections } from '@/hooks/useCollections';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { BookMarked, Trash2, ExternalLink, Loader2, Home, ArrowLeft, Calendar, FileText, Bookmark } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import emzingoLogo from '@/assets/emzingo-logo.png';

const CollectionsPage = () => {
  const { collections, loading, removeFromCollection } = useCollections();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleRemoveItem = async (artifactId: number, title: string) => {
    setDeletingId(artifactId.toString());
    const { error } = await removeFromCollection(artifactId);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from collection. Please try again.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Item Removed",
        description: `${title} has been removed from your collection.`,
      });
    }
    setDeletingId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your collections...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Navigation Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Catalog
              </Button>
              <div className="h-6 w-px bg-border" />
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="hover:bg-white/20 transition-colors"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </div>
            <LanguageSwitcher />
          </div>

          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
              <BookMarked className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              My Collection
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Manage and explore your saved artifacts from the Museo AMANO collection
            </p>
          </div>

          {collections.length === 0 ? (
            <Card className="border-0 shadow-elegant bg-card/50 backdrop-blur-sm">
              <CardContent className="py-16 text-center">
                <div className="max-w-md mx-auto">
                  <div className="inline-flex items-center justify-center p-4 bg-muted/50 rounded-full mb-6">
                    <BookMarked className="h-16 w-16 text-muted-foreground/60" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Your Collection is Empty</h3>
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    Start exploring the Museo AMANO catalog and bookmark artifacts that capture your interest. 
                    Build your personal research collection today.
                  </p>
                  <Button 
                    onClick={() => navigate('/')}
                    className="bg-primary hover:bg-primary/90 shadow-lg transition-all duration-200 hover:scale-105"
                  >
                    <ExternalLink className="h-5 w-5 mr-2" />
                    Explore Catalog
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Collection Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-0 shadow-elegant bg-card/50 backdrop-blur-sm hover:shadow-glow transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                      <Bookmark className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-3xl font-bold text-primary mb-2">{collections.length}</p>
                    <p className="text-sm text-muted-foreground font-medium">Total Artifacts</p>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-elegant bg-card/50 backdrop-blur-sm hover:shadow-glow transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                      <BookMarked className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-3xl font-bold text-primary mb-2">
                      {new Set(collections.map(c => c.collection_name)).size}
                    </p>
                    <p className="text-sm text-muted-foreground font-medium">Collections</p>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-elegant bg-card/50 backdrop-blur-sm hover:shadow-glow transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-3xl font-bold text-primary mb-2">
                      {collections.filter(c => c.notes && c.notes.trim()).length}
                    </p>
                    <p className="text-sm text-muted-foreground font-medium">With Notes</p>
                  </CardContent>
                </Card>
              </div>

              {/* Collections Grid */}
              <div className="grid gap-6">
                {collections.map((item) => (
                  <Card key={item.id} className="border-0 shadow-elegant bg-card/50 backdrop-blur-sm hover:shadow-glow transition-all duration-300 hover:scale-[1.02]">
                    <CardContent className="p-8">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 max-w-4xl">
                          <div className="flex items-center gap-3 mb-4">
                            <h3 className="text-xl font-semibold text-foreground">{item.artifact_title}</h3>
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-medium">
                              {item.collection_name}
                            </Badge>
                          </div>
                          
                          {item.artifact_accession_number && (
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-sm font-medium text-muted-foreground">Accession Number:</span>
                              <span className="text-sm text-foreground font-mono bg-muted/50 px-2 py-1 rounded">
                                {item.artifact_accession_number}
                              </span>
                            </div>
                          )}
                          
                          {item.notes && (
                            <div className="bg-muted/30 border-l-4 border-primary/50 p-4 rounded-r-lg mb-4">
                              <div className="flex items-center gap-2 mb-2">
                                <FileText className="h-4 w-4 text-primary" />
                                <span className="text-sm font-semibold text-foreground">Research Notes</span>
                              </div>
                              <p className="text-sm text-foreground/90 leading-relaxed">{item.notes}</p>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Saved on {new Date(item.created_at).toLocaleDateString(i18n.language, {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 ml-6">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                disabled={deletingId === item.artifact_id.toString()}
                                className="hover:bg-destructive hover:text-destructive-foreground transition-colors"
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
                                <AlertDialogTitle>Remove from Collection</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove "{item.artifact_title}" from your collection? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRemoveItem(item.artifact_id, item.artifact_title)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Remove
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
          
          {/* Footer with partner logo */}
          <div className="mt-16 pt-8 border-t border-border/50">
            <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
              <span>Powered by</span>
              <img 
                src={emzingoLogo} 
                alt="Emzingo|U" 
                className="h-5 object-contain opacity-70 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionsPage;