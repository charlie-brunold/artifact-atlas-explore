import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChevronDown, ChevronUp, X, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdvancedFiltersProps {
  cultures: string[];
  materials: string[];
  conditions: string[];
  periodRange: [number, number];
  tagLogic: 'OR' | 'AND';
  searchQuery: string;
  onFiltersChange: (filters: {
    cultures: string[];
    materials: string[];
    conditions: string[];
    periodRange: [number, number];
    tagLogic: 'OR' | 'AND';
  }) => void;
}

const AdvancedFilters = ({
  cultures,
  materials,
  conditions,
  periodRange,
  tagLogic,
  searchQuery,
  onFiltersChange
}: AdvancedFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const availableOptions = {
    cultures: ['Moche', 'Nazca', 'Chimú', 'Inca', 'Huari', 'Tiahuanaco'],
    materials: ['Cerámica', 'Textil', 'Metal', 'Madera', 'Piedra'],
    conditions: ['Excelente', 'Bueno', 'Regular', 'Malo'],
  };

  const handleCheckboxChange = (type: string, value: string, checked: boolean) => {
    let updatedValues;
    switch (type) {
      case 'cultures':
        updatedValues = checked
          ? [...cultures, value]
          : cultures.filter((item) => item !== value);
        onFiltersChange({
          cultures: updatedValues,
          materials,
          conditions,
          periodRange,
          tagLogic,
        });
        break;
      case 'materials':
        updatedValues = checked
          ? [...materials, value]
          : materials.filter((item) => item !== value);
        onFiltersChange({
          cultures,
          materials: updatedValues,
          conditions,
          periodRange,
          tagLogic,
        });
        break;
      case 'conditions':
        updatedValues = checked
          ? [...conditions, value]
          : conditions.filter((item) => item !== value);
        onFiltersChange({
          cultures,
          materials,
          conditions: updatedValues,
          periodRange,
          tagLogic,
        });
        break;
      default:
        break;
    }
  };

  const handlePeriodChange = (value: number[]) => {
    onFiltersChange({
      cultures,
      materials,
      conditions,
      periodRange: [value[0], value[1]],
      tagLogic,
    });
  };

  const handleTagLogicChange = (value: 'OR' | 'AND') => {
    onFiltersChange({
      cultures,
      materials,
      conditions,
      periodRange,
      tagLogic: value,
    });
  };

  const handleSaveSearch = () => {
    if (!saveSearchName.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un nombre para la búsqueda",
        variant: "destructive"
      });
      return;
    }

    const savedSearches = JSON.parse(localStorage.getItem('saved-searches') || '[]');
    const newSearch = {
      id: Date.now().toString(),
      name: saveSearchName.trim(),
      query: searchQuery,
      filters: {
        cultures,
        materials,
        conditions,
        periodRange: { start: periodRange[0], end: periodRange[1] },
        tagLogic
      },
      createdAt: new Date().toISOString()
    };

    const updatedSearches = [newSearch, ...savedSearches];
    localStorage.setItem('saved-searches', JSON.stringify(updatedSearches));

    toast({
      title: "Búsqueda guardada",
      description: `"${saveSearchName}" ha sido guardada en tu colección`,
    });

    setSaveSearchName('');
    setIsDialogOpen(false);
  };

  const hasActiveFilters =
    cultures.length > 0 || materials.length > 0 || conditions.length > 0;

  const clearAllFilters = () => {
    onFiltersChange({
      cultures: [],
      materials: [],
      conditions: [],
      periodRange: [0, 2000],
      tagLogic: 'OR',
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Filtros Avanzados</CardTitle>
            {hasActiveFilters && (
              <Badge variant="secondary" className="text-xs">
                {cultures.length + materials.length + conditions.length} activos
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs">
                  <Save className="h-3 w-3 mr-1" />
                  Guardar Búsqueda
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Guardar Búsqueda</DialogTitle>
                  <DialogDescription>
                    Dale un nombre a esta búsqueda para acceder fácilmente más tarde
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Nombre de la búsqueda..."
                    value={saveSearchName}
                    onChange={(e) => setSaveSearchName(e.target.value)}
                  />
                  {(searchQuery || hasActiveFilters) && (
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p><strong>Vista previa:</strong></p>
                      {searchQuery && <p>Consulta: "{searchQuery}"</p>}
                      {cultures.length > 0 && <p>Culturas: {cultures.join(', ')}</p>}
                      {materials.length > 0 && <p>Materiales: {materials.join(', ')}</p>}
                      {conditions.length > 0 && <p>Condiciones: {conditions.join(', ')}</p>}
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveSearch}>
                    Guardar Búsqueda
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Culturas</h4>
            <div className="flex flex-wrap gap-2">
              {availableOptions.cultures.map((culture) => (
                <div key={culture} className="flex items-center space-x-2">
                  <Checkbox
                    id={`culture-${culture}`}
                    checked={cultures.includes(culture)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange('cultures', culture, !!checked)
                    }
                  />
                  <Label htmlFor={`culture-${culture}`} className="text-sm">
                    {culture}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Materiales</h4>
            <div className="flex flex-wrap gap-2">
              {availableOptions.materials.map((material) => (
                <div key={material} className="flex items-center space-x-2">
                  <Checkbox
                    id={`material-${material}`}
                    checked={materials.includes(material)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange('materials', material, !!checked)
                    }
                  />
                  <Label htmlFor={`material-${material}`} className="text-sm">
                    {material}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Condiciones</h4>
            <div className="flex flex-wrap gap-2">
              {availableOptions.conditions.map((condition) => (
                <div key={condition} className="flex items-center space-x-2">
                  <Checkbox
                    id={`condition-${condition}`}
                    checked={conditions.includes(condition)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange('conditions', condition, !!checked)
                    }
                  />
                  <Label htmlFor={`condition-${condition}`} className="text-sm">
                    {condition}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Período (DC)</h4>
            <Slider
              defaultValue={periodRange}
              min={0}
              max={2000}
              step={100}
              onValueChange={(value) => handlePeriodChange(value)}
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{periodRange[0]} DC</span>
              <span>{periodRange[1]} DC</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Lógica de Etiquetas</h4>
            <RadioGroup
              defaultValue={tagLogic}
              className="flex gap-2"
              onValueChange={handleTagLogicChange}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="OR" id="tag-logic-or" />
                <Label htmlFor="tag-logic-or">OR</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="AND" id="tag-logic-and" />
                <Label htmlFor="tag-logic-and">AND</Label>
              </div>
            </RadioGroup>
          </div>

          <Button variant="link" size="sm" onClick={clearAllFilters}>
            Limpiar todos los filtros
          </Button>
        </CardContent>
      )}
    </Card>
  );
};

export default AdvancedFilters;
