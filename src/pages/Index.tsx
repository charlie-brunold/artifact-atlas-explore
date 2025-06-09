
import { useState } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ArtifactCard from '@/components/ArtifactCard';
import ArtifactDetail from '@/components/ArtifactDetail';

// Mock data for museum artifacts
const artifacts = [
  {
    id: 1,
    title: "Byzantine Gold Solidus",
    category: "Ancient Coins",
    period: "6th Century CE",
    culture: "Byzantine",
    material: "Gold",
    dimensions: "20mm diameter",
    location: "Constantinople",
    description: "A well-preserved gold solidus featuring Emperor Justinian I, showcasing the sophisticated minting techniques of the Byzantine Empire.",
    provenance: "Acquired from the Whitmore Collection, 1987. Previously documented in the Cairo Museum archives.",
    significance: "This coin represents the economic stability of Justinian's reign and the artistic sophistication of Byzantine imperial imagery.",
    imageUrl: "/placeholder.svg",
    accessionNumber: "BYZ.1987.45",
    dateAcquired: "1987-03-15",
    condition: "Excellent",
    exhibitions: ["Byzantine Gold: Imperial Imagery", "Coins of the Ancient World"],
    bibliography: ["Thompson, M. Byzantine Coinage, 1982", "Davis, L. Imperial Portraits in Gold, 1995"]
  },
  {
    id: 2,
    title: "Ming Dynasty Porcelain Vase",
    category: "Ceramics",
    period: "15th Century CE",
    culture: "Chinese",
    material: "Porcelain with Cobalt Blue Glaze",
    dimensions: "35cm height, 18cm diameter",
    location: "Jingdezhen, China",
    description: "An exquisite blue and white porcelain vase featuring traditional dragon motifs, exemplifying the technical mastery of Ming dynasty ceramics.",
    provenance: "Gift of the Chen Family Collection, 1992. Export documentation from 1923.",
    significance: "Represents the height of Chinese porcelain artistry and the global trade networks of the Ming period.",
    imageUrl: "/placeholder.svg",
    accessionNumber: "MING.1992.12",
    dateAcquired: "1992-07-22",
    condition: "Good - minor restoration on base",
    exhibitions: ["Silk Road Treasures", "Chinese Ceramics Through the Ages"],
    bibliography: ["Li, W. Ming Porcelain Techniques, 1988", "Chen, S. Blue and White Traditions, 2001"]
  },
  {
    id: 3,
    title: "Roman Glass Unguentarium",
    category: "Ancient Glass",
    period: "2nd Century CE",
    culture: "Roman",
    material: "Blown Glass",
    dimensions: "12cm height, 4cm diameter",
    location: "Pompeii, Italy",
    description: "A delicate glass vessel used for storing perfumes and oils, showcasing the advanced glassmaking techniques of the Roman Empire.",
    provenance: "Excavated 1963, Pompeii archaeological site. Donated by Italian Cultural Ministry, 1965.",
    significance: "Provides insight into daily life and luxury goods in ancient Roman society.",
    imageUrl: "/placeholder.svg",
    accessionNumber: "ROM.1965.78",
    dateAcquired: "1965-11-08",
    condition: "Complete with minor surface weathering",
    exhibitions: ["Life in Ancient Rome", "Glass Arts of Antiquity"],
    bibliography: ["Johnson, R. Roman Glassware, 1975", "Martinez, A. Pompeii Artifacts, 1989"]
  },
  {
    id: 4,
    title: "Egyptian Canopic Jar Lid",
    category: "Egyptian Antiquities",
    period: "New Kingdom, 18th Dynasty",
    culture: "Ancient Egyptian",
    material: "Limestone with traces of pigment",
    dimensions: "15cm height, 12cm diameter",
    location: "Valley of the Kings, Egypt",
    description: "Limestone lid of a canopic jar featuring the head of Imsety, one of the four Sons of Horus, used in mummification rituals.",
    provenance: "Legal acquisition from Egyptian authorities, 1925. Originally from Tomb KV55.",
    significance: "Essential artifact for understanding ancient Egyptian funerary practices and religious beliefs.",
    imageUrl: "/placeholder.svg",
    accessionNumber: "EGY.1925.33",
    dateAcquired: "1925-02-14",
    condition: "Excellent with original pigment traces",
    exhibitions: ["Mysteries of Ancient Egypt", "Afterlife Beliefs"],
    bibliography: ["Wilson, T. Egyptian Funerary Arts, 1967", "Hassan, M. Canopic Traditions, 1982"]
  },
  {
    id: 5,
    title: "Medieval Illuminated Manuscript Page",
    category: "Manuscripts",
    period: "13th Century CE",
    culture: "Medieval European",
    material: "Vellum with gold leaf and tempera",
    dimensions: "32cm x 24cm",
    location: "Abbey of Saint-Denis, France",
    description: "A beautifully illuminated page from a Book of Hours featuring intricate marginalia and gold leaf decoration.",
    provenance: "Acquired from the Beaumont Library Collection, 1934. Documented provenance to 15th century.",
    significance: "Exemplifies the artistic and spiritual traditions of medieval monasticism and manuscript production.",
    imageUrl: "/placeholder.svg",
    accessionNumber: "MED.1934.19",
    dateAcquired: "1934-09-03",
    condition: "Very good - some fading of blue pigments",
    exhibitions: ["Medieval Manuscripts", "Sacred Art of the Middle Ages"],
    bibliography: ["Brown, E. Medieval Illumination, 1952", "Laurent, P. French Manuscripts, 1968"]
  },
  {
    id: 6,
    title: "Pre-Columbian Gold Figurine",
    category: "Pre-Columbian Art",
    period: "1000-1500 CE",
    culture: "Muisca",
    material: "Tumbaga (Gold-Copper Alloy)",
    dimensions: "8cm height, 4cm width",
    location: "Lake Guatavita, Colombia",
    description: "A ceremonial gold figurine depicting a shaman or chief, likely used in ritual offerings to the gods.",
    provenance: "Legally acquired through Colombian cultural exchange program, 1978.",
    significance: "Represents the sophisticated metallurgy and religious practices of pre-Columbian South American cultures.",
    imageUrl: "/placeholder.svg",
    accessionNumber: "PRE.1978.56",
    dateAcquired: "1978-12-11",
    condition: "Excellent",
    exhibitions: ["Gold of the Americas", "Pre-Columbian Civilizations"],
    bibliography: ["Rodriguez, C. Muisca Goldwork, 1983", "Taylor, J. Ancient American Metals, 1991"]
  }
];

const categories = [
  "All Categories",
  "Ancient Coins",
  "Ceramics", 
  "Ancient Glass",
  "Egyptian Antiquities",
  "Manuscripts",
  "Pre-Columbian Art"
];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const filteredArtifacts = artifacts.filter(artifact => {
    const matchesSearch = artifact.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artifact.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artifact.culture.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || artifact.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (selectedArtifact) {
    return <ArtifactDetail artifact={selectedArtifact} onBack={() => setSelectedArtifact(null)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Digital Museum Catalogue</h1>
              <p className="text-lg text-muted-foreground">Academic Research Collection</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                {filteredArtifacts.length} artifacts
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filter Section */}
      <section className="bg-muted/30 border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search artifacts, cultures, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[200px] bg-background">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Artifacts Grid */}
      <main className="container mx-auto px-6 py-8">
        {filteredArtifacts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No artifacts found matching your criteria.</p>
            <p className="text-sm text-muted-foreground mt-2">Try adjusting your search terms or category filter.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
          }>
            {filteredArtifacts.map(artifact => (
              <ArtifactCard
                key={artifact.id}
                artifact={artifact}
                viewMode={viewMode}
                onClick={() => setSelectedArtifact(artifact)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
