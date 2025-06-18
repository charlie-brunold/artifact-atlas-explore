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

interface Artifact {
  id: number;
  title: string;
  category: string;
  period: string;
  culture: string;
  material: string;
  dimensions: string;
  location: string;
  description: string;
  provenance: string;
  significance: string;
  imageUrl: string;
  accessionNumber: string;
  dateAcquired: string;
  condition: string;
  exhibitions: string[];
  bibliography: string[];
}

export const mockArtifacts: Artifact[] = [
  {
    id: 1,
    title: "Textile Fragment with Geometric Design",
    category: "Textile",
    period: "Early Horizon",
    culture: "Paracas",
    material: "Camelid fiber",
    dimensions: "15 x 20 cm",
    location: "Museo AMANO, Lima",
    description: "A vibrant textile fragment featuring a complex geometric design, characteristic of the Paracas culture's weaving artistry.",
    provenance: "Excavated from a Paracas necropolis in the Ica Valley, Peru.",
    significance: "Demonstrates the advanced weaving techniques and symbolic language of the Paracas people.",
    imageUrl: "/img/artifacts/paracas_textile.jpg",
    accessionNumber: "AM-TX-001",
    dateAcquired: "1958-03-15",
    condition: "Excellent",
    exhibitions: ["Paracas: Ancient Textiles of Peru, 1992", "Colors of the Andes, 2005"],
    bibliography: ["Paul, A. Paracas Ritual Attire: Symbols of Authority in Ancient Peru. University of Oklahoma Press, 1990.", "Townsend, R. F. The Ancient Americas: Art from Sacred Landscapes. Art Institute of Chicago, 1992."]
  },
  {
    id: 2,
    title: "Ceramic Vessel with Feline Motif",
    category: "Ceramic",
    period: "Middle Horizon",
    culture: "Huari",
    material: "Ceramic",
    dimensions: "25 cm height, 18 cm diameter",
    location: "Museo Nacional de Arqueología, Antropología e Historia del Perú, Lima",
    description: "A finely crafted ceramic vessel adorned with a stylized feline motif, indicative of the Huari culture's artistic and religious beliefs.",
    provenance: "Discovered in a Huari administrative center in the Ayacucho region, Peru.",
    significance: "Represents the Huari culture's integration of diverse artistic traditions and their widespread influence across the Andes.",
    imageUrl: "/img/artifacts/huari_vessel.jpg",
    accessionNumber: "MNA-CR-002",
    dateAcquired: "1965-11-22",
    condition: "Good",
    exhibitions: ["Huari: Empire of the Andes, 2008", "Art andCosmos in the Ancient Andes, 2015"],
    bibliography: ["Isbell, W. H., & McEwan, G. F. (Eds.). Huari Administrative Structure: Prehistoric Monumental Architecture and State Government. Dumbarton Oaks Research Library and Collection, 1991.", "Nash, D. J. (Ed.). The Oxford Handbook of Andean Archaeology. Oxford University Press, 2013."]
  },
  {
    id: 3,
    title: "Feathered Headdress",
    category: "Ornament",
    period: "Late Intermediate Period",
    culture: "Chimú",
    material: "Feathers, cotton, gold",
    dimensions: "30 cm height, 40 cm width",
    location: "Museo del Oro del Perú, Lima",
    description: "An elaborate feathered headdress embellished with gold accents, showcasing the Chimú culture's mastery of featherwork and metalworking.",
    provenance: "Recovered from a Chimú burial site near Chan Chan, Peru.",
    significance: "Symbolizes the Chimú elite's power and status, as well as their sophisticated craftsmanship.",
    imageUrl: "/img/artifacts/chimu_headdress.jpg",
    accessionNumber: "MDOP-OR-003",
    dateAcquired: "1972-06-01",
    condition: "Very good",
    exhibitions: ["Splendors of the Chimú Empire, 1995", "Gold of the Andes, 2007"],
    bibliography: ["Conrad, G. W. Religion and Empire: The Dynamics of Aztec and Inca Expansion. Cambridge University Press, 1984.", " Quilter, J. The Ancient Central Andes. Routledge, 2014."]
  },
  {
    id: 4,
    title: "Kero Cup with Ceremonial Scene",
    category: "Vessel",
    period: "Late Horizon",
    culture: "Inca",
    material: "Wood",
    dimensions: "12 cm height, 8 cm diameter",
    location: "Museo Inka, Cusco",
    description: "A wooden kero cup intricately carved with a ceremonial scene, reflecting the Inca culture's ritual practices and social hierarchy.",
    provenance: "Collected from a noble's tomb in the Cusco region, Peru.",
    significance: "Provides insights into Inca social customs, artistic conventions, and the use of keros in state ceremonies.",
    imageUrl: "/img/artifacts/inca_kero.jpg",
    accessionNumber: "MI-KE-004",
    dateAcquired: "1980-09-10",
    condition: "Excellent",
    exhibitions: ["Inca: Lords of Gold and Glory, 2000", "The Power of theIncas, 2010"],
    bibliography: ["D'Altroy, T. N. The Incas. Blackwell Publishing, 2002.", " Covey, R. A. How the Incas Built Their Heartland: State Formation and the Innovation of Imperial Strategies in the Sacred Valley, Peru. University of Michigan Press, 2019."]
  },
  {
    id: 5,
    title: "Textile Panel with Anthropomorphic Figures",
    category: "Textile",
    period: "Early Intermediate Period",
    culture: "Nazca",
    material: "Cotton, camelid fiber",
    dimensions: "80 x 60 cm",
    location: "Museo Arqueológico Antonini, Nazca",
    description: "A colorful textile panel featuring stylized anthropomorphic figures, characteristic of the Nazca culture's vibrant textile tradition.",
    provenance: "Unearthed from a Nazca burial site in the Nazca Desert, Peru.",
    significance: "Illustrates the Nazca culture's complex iconography and their beliefs about the relationship between humans and the supernatural.",
    imageUrl: "/img/artifacts/nazca_textile.jpg",
    accessionNumber: "MAA-TX-005",
    dateAcquired: "1988-04-01",
    condition: "Good",
    exhibitions: ["Nazca: Decoding the Desert, 2003", "Weavingthe World: Textile Art of Ancient Peru, 2012"],
    bibliography: ["Silverman, H., & Proulx, D. The Nasca. Blackwell Publishers, 2002.", " Aveni, A. Nasca: Eighth Wonder of the World. British Museum Press, 2000."]
  },
  {
    id: 6,
    title: "Chancay Doll",
    category: "Textile Doll",
    period: "Late Intermediate Period",
    culture: "Chancay",
    material: "Cotton",
    dimensions: "40 cm height",
    location: "Museo Textil Precolombino",
    description: "A Chancay doll made of woven cotton, representing a female figure. Chancay dolls are often found in burial sites.",
    provenance: "Excavated from a Chancay burial site near the coast of Peru.",
    significance: "Provides insights into the Chancay culture's burial practices and their views on the afterlife.",
    imageUrl: "/img/artifacts/chancay_doll.jpg",
    accessionNumber: "MTP-TX-006",
    dateAcquired: "1990-07-15",
    condition: "Very good",
    exhibitions: ["Chancay: Textiles and Pottery, 2005", "Daily Life in Ancient Peru, 2014"],
    bibliography: ["d'Harcourt, R. Textiles of Ancient Peru and Their Techniques. University of Washington Press, 1962.", " Frame, M. AndeanFour-Cornered Hats: Ancient Symbols. Thames & Hudson, 2005."]
  }
];

type SortOption = 'relevance' | 'title-asc' | 'title-desc' | 'period-asc' | 'period-desc' | 'culture-asc' | 'culture-desc';
type ViewMode = 'grid' | 'list';

const Index = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<any>({});
  const [currentPage, setCurrentPage] = useState<'catalog' | 'cart' | 'my-collection'>('catalog');

  const filteredArtifacts = mockArtifacts
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

      if (filters.periodEnd === '' || filters.periodEnd === undefined) {
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
