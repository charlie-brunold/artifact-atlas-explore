
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AdvancedFilters from './AdvancedFilters';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onFiltersChange: (filters: any) => void;
  onSaveSearch: (searchName: string, filters: any) => void;
}

const SearchBar = ({ searchTerm, onSearchChange, onFiltersChange, onSaveSearch }: SearchBarProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder={t('search.placeholder')}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex gap-2">
        <AdvancedFilters onFiltersChange={onFiltersChange} onSaveSearch={onSaveSearch} />
      </div>
    </div>
  );
};

export default SearchBar;
