
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid, List, ArrowUpDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type SortOption = 'relevance' | 'title-asc' | 'title-desc' | 'period-asc' | 'period-desc' | 'culture-asc' | 'culture-desc';
type ViewMode = 'grid' | 'list';

interface CatalogControlsProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  resultsCount: number;
}

const CatalogControls = ({ 
  sortBy, 
  onSortChange, 
  viewMode, 
  onViewModeChange, 
  resultsCount 
}: CatalogControlsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Select value={sortBy} onValueChange={(value: SortOption) => onSortChange(value)}>
          <SelectTrigger className="w-48">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            <SelectValue placeholder={t('search.sortBy')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">{t('sorting.relevance')}</SelectItem>
            <SelectItem value="title-asc">{t('sorting.titleAsc')}</SelectItem>
            <SelectItem value="title-desc">{t('sorting.titleDesc')}</SelectItem>
            <SelectItem value="period-asc">{t('sorting.periodAsc')}</SelectItem>
            <SelectItem value="period-desc">{t('sorting.periodDesc')}</SelectItem>
            <SelectItem value="culture-asc">{t('sorting.cultureAsc')}</SelectItem>
            <SelectItem value="culture-desc">{t('sorting.cultureDesc')}</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-1 border rounded-md">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
          >
            <Grid className="h-4 w-4" />
            <span className="ml-1 hidden sm:inline">{t('search.grid')}</span>
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
          >
            <List className="h-4 w-4" />
            <span className="ml-1 hidden sm:inline">{t('search.list')}</span>
          </Button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        {t('search.resultsFound', { count: resultsCount })}
      </div>
    </div>
  );
};

export default CatalogControls;
