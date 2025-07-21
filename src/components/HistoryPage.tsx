import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { History, FileText, ExternalLink } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

const HistoryPage = () => {
  const { t } = useTranslation();
  
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
        return t('history.statusCompleted');
      case 'pending':
        return t('history.statusPending');
      case 'cancelled':
        return t('history.statusCancelled');
      default:
        return t('history.statusUnknown');
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <History className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">{t('history.title')}</h1>
              <p className="text-muted-foreground">
                {t('history.description')}
              </p>
            </div>
          </div>
          <LanguageSwitcher />
        </div>

        {mockHistory.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">{t('history.noRequests')}</h3>
              <p className="text-muted-foreground mb-4">
                {t('history.noRequestsDesc')}
              </p>
              <Button variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                {t('history.exploreCatalog')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Summary Stats */}
            <Card>
              <CardHeader>
                <CardTitle>{t('history.activitySummary')}</CardTitle>
                <CardDescription>
                  {t('history.activitySummaryDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{mockHistory.length}</p>
                    <p className="text-sm text-muted-foreground">{t('history.totalRequests')}</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {mockHistory.filter(h => h.status === 'completed').length}
                    </p>
                    <p className="text-sm text-muted-foreground">{t('history.completed')}</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">
                      {mockHistory.filter(h => h.status === 'pending').length}
                    </p>
                    <p className="text-sm text-muted-foreground">{t('history.pending')}</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">
                      ${mockHistory.reduce((sum, h) => sum + h.totalCost, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">{t('history.totalInvested')}</p>
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
                            {t('history.requestId', { id: request.id })}
                          </h3>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusText(request.status)}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <p className="text-sm">
                            <span className="font-medium">{t('history.artifacts')}:</span>{' '}
                            {request.artifacts.join(', ')}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">{t('history.duration')}:</span> {request.duration}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">{t('history.totalCost')}:</span> ${request.totalCost}
                          </p>
                        </div>
                        
                        <p className="text-xs text-muted-foreground">
                          {t('history.requestedOn')} {new Date(request.date).toLocaleDateString(t('common.locale'), {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          {t('history.viewDetails')}
                        </Button>
                        {request.status === 'completed' && (
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            {t('history.downloadReceipt')}
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