import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Palette } from 'lucide-react';
import RentalButton from './RentalButton';

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
  imageUrl: string;
  accessionNumber: string;
  condition: string;
}

interface ArtifactCardProps {
  artifact: Artifact;
  viewMode: 'grid' | 'list';
  onClick: () => void;
}

const ArtifactCard = ({ artifact, viewMode, onClick }: ArtifactCardProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    const fallback = target.nextElementSibling as HTMLElement;
    target.style.display = 'none';
    if (fallback) {
      fallback.style.display = 'flex';
    }
  };

  if (viewMode === 'list') {
    return (
      <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50" onClick={onClick}>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-48 md:h-32 bg-muted flex items-center justify-center text-muted-foreground">
            <img 
              src={artifact.imageUrl} 
              alt={artifact.title}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
            <div className="hidden w-full h-full items-center justify-center text-sm">
              Image Not Available
            </div>
          </div>
          <div className="flex-1 p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {artifact.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{artifact.accessionNumber}</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{artifact.title}</h3>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{artifact.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{artifact.period}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{artifact.culture}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Palette className="h-3 w-3" />
                    <span>{artifact.material}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <RentalButton artifact={artifact} size="sm" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50 overflow-hidden" onClick={onClick}>
      <div className="aspect-square bg-muted flex items-center justify-center text-muted-foreground">
        <img 
          src={artifact.imageUrl} 
          alt={artifact.title}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        <div className="hidden w-full h-full items-center justify-center text-sm">
          Image Not Available
        </div>
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            {artifact.category}
          </Badge>
          <span className="text-xs text-muted-foreground">{artifact.accessionNumber}</span>
        </div>
        <CardTitle className="text-lg leading-tight">{artifact.title}</CardTitle>
        <CardDescription className="text-sm">
          {artifact.culture} • {artifact.period}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {artifact.description}
        </p>
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Palette className="h-3 w-3" />
            <span>{artifact.material}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{artifact.location}</span>
          </div>
        </div>
        <div className="mt-4">
          <RentalButton artifact={artifact} size="sm" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ArtifactCard;
