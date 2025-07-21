
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useTranslation } from 'react-i18next';
import { Loader2, User, Edit, Save, X } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import PageHeader from './PageHeader';

interface ProfileFormData {
  full_name: string;
  institution: string;
  research_credentials: string;
}

const ProfilePage = () => {
  const { user } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProfileFormData>({
    defaultValues: {
      full_name: profile?.full_name || '',
      institution: profile?.institution || '',
      research_credentials: profile?.research_credentials || '',
    },
  });

  React.useEffect(() => {
    if (profile) {
      form.reset({
        full_name: profile.full_name || '',
        institution: profile.institution || '',
        research_credentials: profile.research_credentials || '',
      });
    }
  }, [profile, form]);

  const onSubmit = async (data: ProfileFormData) => {
    setUpdating(true);
    const { error } = await updateProfile(data);
    
    if (error) {
      toast({
        title: t('common.error'),
        description: t('profile.updateError'),
        variant: "destructive"
      });
    } else {
      toast({
        title: t('profile.updated'),
        description: t('profile.updateSuccess'),
      });
      setIsEditing(false);
    }
    setUpdating(false);
  };

  const handleCancel = () => {
    form.reset({
      full_name: profile?.full_name || '',
      institution: profile?.institution || '',
      research_credentials: profile?.research_credentials || '',
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <>
        <PageHeader 
          title={t('profile.title')} 
          description={t('profile.description')}
        />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader 
        title={t('profile.title')} 
        description={t('profile.description')}
      />
      
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-6">
            {/* Account Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{t('profile.personalInfo')}</CardTitle>
                    <CardDescription>
                      {t('profile.personalInfoDesc')}
                    </CardDescription>
                  </div>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {t('profile.edit')}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          {t('auth.email')}
                        </Label>
                        <p className="text-sm">{user?.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          {t('auth.fullName')}
                        </Label>
                        <p className="text-sm">{profile?.full_name || t('profile.notSpecified')}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          {t('auth.institution')}
                        </Label>
                        <p className="text-sm">{profile?.institution || t('profile.notSpecified')}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          {t('profile.researchCredentials')}
                        </Label>
                        <p className="text-sm">{profile?.research_credentials || t('profile.notSpecified')}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">
                            {t('auth.email')}
                          </Label>
                          <p className="text-sm text-muted-foreground">{user?.email}</p>
                          <p className="text-xs text-muted-foreground">
                            {t('profile.emailChangeNote')}
                          </p>
                        </div>
                        <FormField
                          control={form.control}
                          name="full_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('auth.fullName')}</FormLabel>
                              <FormControl>
                                <Input placeholder={t('profile.fullNamePlaceholder')} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="institution"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('auth.institution')}</FormLabel>
                              <FormControl>
                                <Input placeholder={t('profile.institutionPlaceholder')} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="research_credentials"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('profile.researchCredentials')}</FormLabel>
                              <FormControl>
                                <Input placeholder={t('profile.credentialsPlaceholder')} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button type="submit" disabled={updating}>
                          {updating ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              {t('profile.saving')}
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              {t('profile.saveChanges')}
                            </>
                          )}
                        </Button>
                        <Button type="button" variant="outline" onClick={handleCancel}>
                          <X className="h-4 w-4 mr-2" />
                          {t('common.cancel')}
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>

            {/* Account Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.accountStats')}</CardTitle>
                <CardDescription>
                  {t('profile.accountStatsDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">0</p>
                    <p className="text-sm text-muted-foreground">{t('profile.savedArtifacts')}</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">0</p>
                    <p className="text-sm text-muted-foreground">{t('profile.searchesPerformed')}</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">0</p>
                    <p className="text-sm text-muted-foreground">{t('profile.rentalRequests')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
