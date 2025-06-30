
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import ArtifactDetail from '@/components/ArtifactDetail';
import CartSummary from '@/components/CartSummary';
import CartPage from '@/components/CartPage';
import SearchBar from '@/components/SearchBar';
import CatalogControls from '@/components/CatalogControls';
import ArtifactGrid from '@/components/ArtifactGrid';
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
  const [currentPage, setCurrentPage] = useState<'catalog' | 'cart'>('catalog');

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
      <Header />

      <main className="container mx-auto px-6 py-8">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onFiltersChange={handleFiltersChange}
          onSaveSearch={handleSaveSearch}
        />

        <CatalogControls
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          resultsCount={filteredArtifacts.length}
        />

        <ArtifactGrid
          artifacts={filteredArtifacts}
          viewMode={viewMode}
          onArtifactClick={handleArtifactClick}
        />
      </main>

      <CartSummary onViewCart={() => setCurrentPage('cart')} />
    </div>
  );
};

export default Index;
