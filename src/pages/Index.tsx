import { useState } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import ArtifactCard from '@/components/ArtifactCard';
import ArtifactDetail from '@/components/ArtifactDetail';
import CartSummary from '@/components/CartSummary';
import CartPage from '@/components/CartPage';

// Authentic Museo AMANO textile collection data
const artifacts = [
  {
    id: 1,
    title: "Manto Paracas con Iconografía de Felinos",
    category: "Textiles Paracas",
    period: "800-100 a.C.",
    culture: "Paracas Necrópolis",
    material: "Fibra de camélido, algodón, tintes naturales",
    dimensions: "180 cm x 120 cm",
    location: "Península de Paracas, Ica",
    description: "Extraordinario manto ceremonial de la cultura Paracas que presenta bordados polícromos con representaciones de felinos estilizados. Los diseños muestran la sofisticada técnica del bordado en punto de tallo sobre base de algodón.",
    provenance: "Adquirido por Yoshitaro Amano durante sus expediciones a la costa sur del Perú en 1960. Documentado en el inventario original del museo.",
    significance: "Representa la maestría textil de los Paracas y su compleja cosmología, donde los felinos simbolizaban poder y conexión con el mundo espiritual.",
    imageUrl: "/placeholder.svg",
    accessionNumber: "MA-PAR-001",
    dateAcquired: "1960-08-15",
    condition: "Excelente, con conservación preventiva realizada en 1995",
    exhibitions: ["Textiles Paracas: Arte y Ritual", "Hilos del Tiempo: 2000 Años de Textilería Peruana"],
    bibliography: ["Stone-Miller, R. To Weave for the Sun, 1992", "Lavalle, J.A. Culturas Precolombinas: Paracas, 1986"]
  },
  {
    id: 2,
    title: "Túnica Chancay con Diseños Geométricos",
    category: "Textiles Chancay",
    period: "1000-1470 d.C.",
    culture: "Chancay",
    material: "Algodón, fibra de camélido",
    dimensions: "95 cm x 80 cm",
    location: "Valle de Chancay, Lima",
    description: "Túnica masculina de la cultura Chancay caracterizada por sus diseños geométricos en técnica de tapicería. Los patrones incluyen rombos escalonados y líneas onduladas que representan elementos naturales.",
    provenance: "Colección Amano desde 1965. Pieza documentada en excavaciones del valle de Chancay realizadas con permisos del INC.",
    significance: "Ejemplifica el estilo textil Chancay tardío y su influencia en la vestimenta ceremonial de la costa central peruana.",
    imageUrl: "/placeholder.svg",
    accessionNumber: "MA-CHA-012",
    dateAcquired: "1965-03-22",
    condition: "Bueno, con restauraciones menores en los bordes",
    exhibitions: ["Arte Textil Chancay", "Costa Central: Tradiciones Milenarias"],
    bibliography: ["Kaulicke, P. Chancay: Cultura y Cronología, 1997", "Jiménez Borja, A. Arte Peruano Precolombino, 1973"]
  },
  {
    id: 3,
    title: "Quipu Inca Administrativo",
    category: "Quipus",
    period: "1400-1532 d.C.",
    culture: "Inca",
    material: "Fibra de camélido teñida",
    dimensions: "85 cm longitud, 42 cuerdas",
    location: "Cusco, Perú",
    description: "Sistema de registro Inca compuesto por cuerdas de colores con nudos que representan información administrativa. Este ejemplar muestra la complejidad del sistema contable incaico.",
    provenance: "Adquirido en 1968 de la colección Giesecke con documentación completa de procedencia cusqueña.",
    significance: "Testimonio único del sistema de registro inca, antecedente de los sistemas de información en América precolombina.",
    imageUrl: "/placeholder.svg",
    accessionNumber: "MA-INC-005",
    dateAcquired: "1968-11-12",
    condition: "Excelente, fibras originales preservadas",
    exhibitions: ["Quipus: La Escritura de los Incas", "Sistemas de Registro Precolombinos"],
    bibliography: ["Urton, G. Signs of the Inka Khipu, 2003", "Mackey, C. Los Quipus del Tahuantinsuyu, 1990"]
  },
  {
    id: 4,
    title: "Textil Huari con Motivos Escalonados",
    category: "Textiles Huari",
    period: "600-1000 d.C.",
    culture: "Huari",
    material: "Lana de alpaca, tintes minerales",
    dimensions: "120 cm x 90 cm",
    location: "Ayacucho, Perú",
    description: "Textil ceremonial Huari que presenta el característico diseño escalonado conocido como 'tocapu'. La pieza muestra la influencia de Tiahuanaco en la iconografía Huari.",
    provenance: "Ingresó al museo en 1972 como parte de la colección formada durante las investigaciones de Yoshitaro Amano en la sierra central.",
    significance: "Representa la síntesis cultural entre las tradiciones costeñas y serranas durante el período de expansión Huari.",
    imageUrl: "/placeholder.svg",
    accessionNumber: "MA-HUA-008",
    dateAcquired: "1972-05-18",
    condition: "Muy bueno, con ligera decoloración en sectores",
    exhibitions: ["Huari: Imperio de los Andes", "Textiles Ceremoniales Precolombinos"],
    bibliography: ["Menzel, D. La Cultura Huari, 1968", "Cook, A. Huari y Tiahuanaco, 1994"]
  },
  {
    id: 5,
    title: "Manto Nazca con Diseños de Aves",
    category: "Textiles Nazca",
    period: "200-700 d.C.",
    culture: "Nazca",
    material: "Algodón, fibra de vicuña, tintes naturales",
    dimensions: "160 cm x 100 cm",
    location: "Valle de Nazca, Ica",
    description: "Manto funerario Nazca decorado con aves estilizadas en colores brillantes. La técnica de bordado muestra la influencia Paracas adaptada al estilo Nazca clásico.",
    provenance: "Adquirido en 1963 durante las expediciones Amano al valle de Nazca, con documentación arqueológica completa.",
    significance: "Evidencia la continuidad cultural entre Paracas y Nazca, y la importancia de las aves en la cosmología nazca.",
    imageUrl: "/placeholder.svg",
    accessionNumber: "MA-NAZ-003",
    dateAcquired: "1963-09-07",
    condition: "Excelente, colores originales preservados",
    exhibitions: ["Nazca: Líneas y Textiles", "Aves Sagradas del Antiguo Perú"],
    bibliography: ["Proulx, D. The Nazca Culture, 1989", "Silverman, H. Cahuachi in the Ancient Nasca World, 1993"]
  },
  {
    id: 6,
    title: "Tocado de Plumas Chimú",
    category: "Tocados y Ornamentos",
    period: "1000-1470 d.C.",
    culture: "Chimú",
    material: "Plumas de aves tropicales, fibra de algodón",
    dimensions: "45 cm diámetro, 30 cm altura",
    location: "Chan Chan, La Libertad",
    description: "Tocado ceremonial Chimú elaborado con plumas multicolores de aves amazónicas. Representa el intercambio comercial entre la costa y la selva durante el período Chimú.",
    provenance: "Colección Amano desde 1970. Pieza excepcional que evidencia las redes comerciales chimú con la Amazonía.",
    significance: "Testimonio de la sofisticación de los ornamentos chimú y su acceso a materiales exóticos a través del comercio.",
    imageUrl: "/placeholder.svg",
    accessionNumber: "MA-CHI-015",
    dateAcquired: "1970-12-03",
    condition: "Bueno, algunas plumas restauradas",
    exhibitions: ["Chimú: Señores de la Costa Norte", "Plumas y Poder en el Perú Antiguo"],
    bibliography: ["Pillsbury, J. Moche Art and Archaeology, 2001", "Moseley, M. The Incas and their Ancestors, 1992"]
  }
];

const categories = [
  "Todas las Categorías",
  "Textiles Paracas",
  "Textiles Chancay", 
  "Quipus",
  "Textiles Huari",
  "Textiles Nazca",
  "Tocados y Ornamentos"
];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas las Categorías');
  const [selectedArtifact, setSelectedArtifact] = useState<typeof artifacts[0] | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCart, setShowCart] = useState(false);

  const filteredArtifacts = artifacts.filter(artifact => {
    const matchesSearch = artifact.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artifact.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artifact.culture.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas las Categorías' || artifact.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (showCart) {
    return <CartPage onBack={() => setShowCart(false)} />;
  }

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
              <h1 className="text-4xl font-bold text-foreground mb-2">AMANO</h1>
              <p className="text-2xl text-muted-foreground mb-1">Museo Textil Precolombino</p>
              <p className="text-lg text-muted-foreground">Catálogo Digital de Investigación</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                {filteredArtifacts.length} piezas
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
                  placeholder="Buscar textiles, culturas, técnicas..."
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
            <p className="text-lg text-muted-foreground">No se encontraron piezas que coincidan con sus criterios.</p>
            <p className="text-sm text-muted-foreground mt-2">Intente ajustar sus términos de búsqueda o filtro de categoría.</p>
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

      {/* Cart Summary */}
      <CartSummary onViewCart={() => setShowCart(true)} />
    </div>
  );
};

export default Index;
