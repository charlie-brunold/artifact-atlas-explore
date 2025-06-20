import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Grid, List, ArrowUpDown, Filter, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/Logo';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ArtifactCard from '@/components/ArtifactCard';
import ArtifactDetail from '@/components/ArtifactDetail';
import AdvancedFilters from '@/components/AdvancedFilters';
import CartSummary from '@/components/CartSummary';
import CartPage from '@/components/CartPage';
import { useTranslatedArtifacts, Artifact } from '@/utils/artifactData';

type SortOption = 'relevance' | 'title-asc' | 'title-desc' | 'period-asc' | 'period-desc' | 'culture-asc' | 'culture-desc';
type ViewMode = 'grid' | 'list';

const Index = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const artifacts = useTranslatedArtifacts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<any>({});
  const [currentPage, setCurrentPage] = useState<'catalog' | 'cart' | 'my-collection'>('catalog');

  const filteredArtifacts = artifacts
    .filter(artifact => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        artifact.title.toLowerCase().includes(searchTermLower) ||
        artifact.description.toLowerCase().includes(searchTermLower) ||
        artifact.culture.toLowerCase().includes(searchTermLower) ||
        artifact.period.toLowerCase().includes(searchTermLower)
      );
    })
    .filter(artifact => {
      if (Object.keys(filters).length === 0) return true;

      let cultureMatch = filters.cultures ? filters.cultures.includes(artifact.culture) : true;
      let materialMatch = filters.materials ? filters.materials.includes(artifact.material) : true;
      let conditionMatch = filters.conditions ? filters.conditions.includes(artifact.condition) : true;
      let periodStartMatch = filters.period ? parseInt(artifact.period.split(' ')[0]) >= parseInt(filters.periodStart) : true;
      let periodEndMatch = filters.period ? parseInt(artifact.period.split(' ')[0]) <= parseInt(filters.periodEnd) : true;

      if (filters.periodStart === '' || filters.periodStart === undefined) {
        periodStartMatch = true;
      }

      if (filters.periodEnd === '' || filters.periodEnd === undefined) {
        periodEndMatch = true;
      }
    
      if (filters.tagLogic === 'OR') {
        return cultureMatch || materialMatch || conditionMatch || (periodStartMatch && periodEndMatch);
      } else {
        return cultureMatch && materialMatch && conditionMatch && (periodStartMatch && periodEndMatch);
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'period-asc':
          return parseInt(a.period.split(' ')[0]) - parseInt(b.period.split(' ')[0]);
        case 'period-desc':
          return parseInt(b.period.split(' ')[0]) - parseInt(a.period.split(' ')[0]);
        case 'culture-asc':
          return a.culture.localeCompare(b.culture);
        case 'culture-desc':
          return b.culture.localeCompare(a.culture);
        default:
          return 0;
      }
    });

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleSaveSearch = (searchName: string, filters: any) => {
    const savedSearches = JSON.parse(localStorage.getItem('saved-searches') || '[]');
    const newSearch = {
      id: Date.now(),
      name: searchName,
      filters,
      searchTerm,
      createdAt: new Date().toISOString()
    };
    savedSearches.push(newSearch);
    localStorage.setItem('saved-searches', JSON.stringify(savedSearches));
    
    toast({
      title: t('notifications.searchSaved'),
      description: t('notifications.searchSavedDesc', { name: searchName }),
    });
  };

  const trackRecentlyViewed = (artifact: Artifact) => {
    const recentlyViewed = JSON.parse(localStorage.getItem('recently-viewed') || '[]');
    const filtered = recentlyViewed.filter((item: any) => item.id !== artifact.id);
    const updated = [{ ...artifact, viewedAt: new Date().toISOString() }, ...filtered].slice(0, 10);
    localStorage.setItem('recently-viewed', JSON.stringify(updated));
  };

  const handleArtifactClick = (artifact: Artifact) => {
    trackRecentlyViewed(artifact);
    setSelectedArtifact(artifact);
  };

  if (currentPage === 'cart') {
    return <CartPage onBack={() => setCurrentPage('catalog')} />;
  }

  if (selectedArtifact) {
    return (
      <ArtifactDetail
        artifact={selectedArtifact}
        onBack={() => setSelectedArtifact(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <Logo />
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <Button 
                variant="outline" 
                onClick={() => setCurrentPage('my-collection')}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                {t('header.myCollection')}
              </Button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t('search.placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <AdvancedFilters onFiltersChange={handleFiltersChange} onSaveSearch={handleSaveSearch} />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Controls Row */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
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
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
                <span className="ml-1 hidden sm:inline">{t('search.grid')}</span>
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
                <span className="ml-1 hidden sm:inline">{t('search.list')}</span>
              </Button>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            {t('search.resultsFound', { count: filteredArtifacts.length })}
          </div>
        </div>

        {/* Results Grid/List */}
        {filteredArtifacts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">{t('search.noResults')}</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
          }>
            {filteredArtifacts.map((artifact) => (
              <ArtifactCard
                key={artifact.id}
                artifact={artifact}
                viewMode={viewMode}
                onClick={() => handleArtifactClick(artifact)}
              />
            ))}
          </div>
        )}
      </main>

      <CartSummary onViewCart={() => setCurrentPage('cart')} />
    </div>
  );
};

export default Index;
