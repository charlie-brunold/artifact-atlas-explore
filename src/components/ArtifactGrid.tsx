
import { useTranslation } from 'react-i18next';
import ArtifactCard from './ArtifactCard';
import { Artifact } from '@/utils/artifactData';

type ViewMode = 'grid' | 'list';

interface ArtifactGridProps {
  artifacts: Artifact[];
  viewMode: ViewMode;
  onArtifactClick: (artifact: Artifact) => void;
}

const ArtifactGrid = ({ artifacts, viewMode, onArtifactClick }: ArtifactGridProps) => {
  const { t } = useTranslation();

  if (artifacts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">{t('search.noResults')}</p>
      </div>
    );
  }

  return (
    <div className={viewMode === 'grid' 
      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
      : "space-y-4"
    }>
      {artifacts.map((artifact) => (
        <ArtifactCard
          key={artifact.id}
          artifact={artifact}
          viewMode={viewMode}
          onClick={() => onArtifactClick(artifact)}
        />
      ))}
    </div>
  );
};

export default ArtifactGrid;
