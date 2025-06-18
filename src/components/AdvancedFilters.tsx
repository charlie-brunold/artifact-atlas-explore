
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, X, Save } from 'lucide-react';

interface AdvancedFiltersProps {
  onFiltersChange: (filters: any) => void;
  onSaveSearch: (searchName: string, filters: any) => void;
}

const cultures = ['Paracas', 'Chancay', 'Inca', 'Huari', 'Nazca', 'Chimú'];
const materials = ['Fibra de camélido', 'Algodón', 'Lana de alpaca', 'Plumas', 'Fibra de vicuña'];
const conditions = ['Excelente', 'Muy bueno', 'Bueno'];

const AdvancedFilters = ({ onFiltersChange, onSaveSearch }: AdvancedFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCultures, setSelectedCultures] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [tagLogic, setTagLogic] = useState<'OR' | 'AND'>('OR');
  const [searchName, setSearchName] = useState('');

  const handleCultureToggle = (culture: string) => {
    const updated = selectedCultures.includes(culture)
      ? selectedCultures.filter(c => c !== culture)
      : [...selectedCultures, culture];
    setSelectedCultures(updated);
    applyFilters({ cultures: updated });
  };

  const handleMaterialToggle = (material: string) => {
    const updated = selectedMaterials.includes(material)
      ? selectedMaterials.filter(m => m !== material)
      : [...selectedMaterials, material];
    setSelectedMaterials(updated);
    applyFilters({ materials: updated });
  };

  const handleConditionToggle = (condition: string) => {
    const updated = selectedConditions.includes(condition)
      ? selectedConditions.filter(c => c !== condition)
      : [...selectedConditions, condition];
    setSelectedConditions(updated);
    applyFilters({ conditions: updated });
  };

  const applyFilters = (updates: any = {}) => {
    const filters = {
      cultures: selectedCultures,
      materials: selectedMaterials,
      conditions: selectedConditions,
      periodStart,
      periodEnd,
      tagLogic,
      ...updates
    };
    onFiltersChange(filters);
  };

  const clearFilters = () => {
    setSelectedCultures([]);
    setSelectedMaterials([]);
    setSelectedConditions([]);
    setPeriodStart('');
    setPeriodEnd('');
    setTagLogic('OR');
    onFiltersChange({});
  };

  const handleSaveSearch = () => {
    if (searchName.trim()) {
      const filters = {
        cultures: selectedCultures,
        materials: selectedMaterials,
        conditions: selectedConditions,
        periodStart,
        periodEnd,
        tagLogic
      };
      onSaveSearch(searchName, filters);
      setSearchName('');
    }
  };

  const hasActiveFilters = selectedCultures.length > 0 || selectedMaterials.length > 0 || 
    selectedConditions.length > 0 || periodStart || periodEnd;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <span>Filtros Avanzados</span>
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1">
              {selectedCultures.length + selectedMaterials.length + selectedConditions.length}
            </Badge>
          )}
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-4">
        <div className="bg-muted/30 p-6 rounded-lg space-y-6">
          {/* Period Range */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Rango de Período</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Año inicio (ej: 800)"
                value={periodStart}
                onChange={(e) => {
                  setPeriodStart(e.target.value);
                  applyFilters({ periodStart: e.target.value });
                }}
              />
              <Input
                placeholder="Año fin (ej: 100)"
                value={periodEnd}
                onChange={(e) => {
                  setPeriodEnd(e.target.value);
                  applyFilters({ periodEnd: e.target.value });
                }}
              />
            </div>
          </div>

          {/* Tag Logic */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Lógica de Filtros</Label>
            <Select value={tagLogic} onValueChange={(value: 'OR' | 'AND') => {
              setTagLogic(value);
              applyFilters({ tagLogic: value });
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OR">Cualquier criterio (OR)</SelectItem>
                <SelectItem value="AND">Todos los criterios (AND)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cultures */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Culturas</Label>
            <div className="flex flex-wrap gap-2">
              {cultures.map(culture => (
                <div key={culture} className="flex items-center space-x-2">
                  <Checkbox
                    id={`culture-${culture}`}
                    checked={selectedCultures.includes(culture)}
                    onCheckedChange={() => handleCultureToggle(culture)}
                  />
                  <Label htmlFor={`culture-${culture}`} className="text-sm">{culture}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Materials */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Materiales</Label>
            <div className="flex flex-wrap gap-2">
              {materials.map(material => (
                <div key={material} className="flex items-center space-x-2">
                  <Checkbox
                    id={`material-${material}`}
                    checked={selectedMaterials.includes(material)}
                    onCheckedChange={() => handleMaterialToggle(material)}
                  />
                  <Label htmlFor={`material-${material}`} className="text-sm">{material}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Conditions */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Estado de Conservación</Label>
            <div className="flex flex-wrap gap-2">
              {conditions.map(condition => (
                <div key={condition} className="flex items-center space-x-2">
                  <Checkbox
                    id={`condition-${condition}`}
                    checked={selectedConditions.includes(condition)}
                    onCheckedChange={() => handleConditionToggle(condition)}
                  />
                  <Label htmlFor={`condition-${condition}`} className="text-sm">{condition}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Save Search */}
          <div className="space-y-2 pt-4 border-t">
            <Label className="text-sm font-medium">Guardar Búsqueda</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Nombre de la búsqueda..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              <Button onClick={handleSaveSearch} disabled={!searchName.trim()}>
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button onClick={clearFilters} variant="outline">
              <X className="h-4 w-4 mr-2" />
              Limpiar Filtros
            </Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AdvancedFilters;
