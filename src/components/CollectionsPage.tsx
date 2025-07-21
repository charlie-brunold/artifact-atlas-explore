import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCollections } from '@/hooks/useCollections';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { BookMarked, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import LanguageSwitcher from './LanguageSwitcher';

const CollectionsPage = () => {
  const { collections, loading, removeFromCollection } = useCollections();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleRemoveItem = async (artifactId: number, title: string) => {
    setDeletingId(artifactId.toString());
    const { error } = await removeFromCollection(artifactId);
    
    if (error) {
      toast({
        title: t('common.error'),
        description: t('collections.removeError'),
        variant: "destructive"
      });
    } else {
      toast({
        title: t('collections.itemRemoved'),
        description: t('collections.removeSuccess', { title }),
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BookMarked className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">{t('collections.title')}</h1>
              <p className="text-muted-foreground">
                {t('collections.description')}
              </p>
            </div>
          </div>
          <LanguageSwitcher />
        </div>

        {collections.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookMarked className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">{t('collections.noItems')}</h3>
              <p className="text-muted-foreground mb-4">
                {t('collections.noItemsDesc')}
              </p>
              <Button variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                {t('collections.exploreCatalog')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Collection Summary */}
            <Card>
              <CardHeader>
                <CardTitle>{t('collections.summary')}</CardTitle>
                <CardDescription>
                  {t('collections.summaryDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{collections.length}</p>
                    <p className="text-sm text-muted-foreground">{t('collections.totalItems')}</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">
                      {new Set(collections.map(c => c.collection_name)).size}
                    </p>
                    <p className="text-sm text-muted-foreground">{t('collections.collectionsCount')}</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">
                      {collections.filter(c => c.notes && c.notes.trim()).length}
                    </p>
                    <p className="text-sm text-muted-foreground">{t('collections.withNotes')}</p>
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
                            {t('collections.accessionNumber')}: {item.artifact_accession_number}
                          </p>
                        )}
                        
                        {item.notes && (
                          <div className="bg-muted/50 p-3 rounded-md mb-3">
                            <p className="text-sm font-medium mb-1">{t('collections.notes')}:</p>
                            <p className="text-sm">{item.notes}</p>
                          </div>
                        )}
                        
                        <p className="text-xs text-muted-foreground">
                          {t('collections.savedOn')} {new Date(item.created_at).toLocaleDateString(t('common.locale'), {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          {t('collections.viewDetail')}
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
                              <AlertDialogTitle>{t('collections.deleteTitle')}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {t('collections.deleteDesc', { title: item.artifact_title })}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRemoveItem(item.artifact_id, item.artifact_title)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {t('collections.delete')}
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