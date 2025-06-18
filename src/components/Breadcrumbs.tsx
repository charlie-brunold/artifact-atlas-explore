
import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
      <Button variant="ghost" size="sm" onClick={items[0]?.onClick} className="p-1 h-auto">
        <Home className="h-4 w-4" />
      </Button>
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronRight className="h-4 w-4" />
          <Button
            variant="ghost"
            size="sm"
            onClick={item.onClick}
            className={`p-1 h-auto ${item.active ? 'text-foreground font-medium' : 'hover:text-foreground'}`}
            disabled={item.active}
          >
            {item.label}
          </Button>
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
