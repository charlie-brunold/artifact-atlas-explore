
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, MapPin, Palette, Ruler, FileText, Award, BookOpen } from 'lucide-react';

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

interface ArtifactDetailProps {
  artifact: Artifact;
  onBack: () => void;
}

const ArtifactDetail = ({ artifact, onBack }: ArtifactDetailProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Catalogue
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{artifact.title}</h1>
              <p className="text-muted-foreground">{artifact.accessionNumber}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="aspect-square bg-muted flex items-center justify-center text-muted-foreground">
                  <img 
                    src={artifact.imageUrl} 
                    alt={artifact.title}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-full items-center justify-center text-lg">
                    High-Resolution Image Available Upon Request
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Facts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Quick Facts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{artifact.category}</Badge>
                </div>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Period:</span>
                    <span>{artifact.period}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Culture:</span>
                    <span>{artifact.culture}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Material:</span>
                    <span>{artifact.material}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Dimensions:</span>
                    <span>{artifact.dimensions}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Condition:</span>
                    <span>{artifact.condition}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{artifact.description}</p>
              </CardContent>
            </Card>

            {/* Cultural Significance */}
            <Card>
              <CardHeader>
                <CardTitle>Cultural Significance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{artifact.significance}</p>
              </CardContent>
            </Card>

            {/* Provenance */}
            <Card>
              <CardHeader>
                <CardTitle>Provenance</CardTitle>
                <CardDescription>Acquisition History and Documentation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">{artifact.provenance}</p>
                <Separator />
                <div className="text-sm">
                  <p><span className="font-medium">Date Acquired:</span> {new Date(artifact.dateAcquired).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p><span className="font-medium">Original Location:</span> {artifact.location}</p>
                </div>
              </CardContent>
            </Card>

            {/* Exhibitions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Exhibition History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {artifact.exhibitions.map((exhibition, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                      {exhibition}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Bibliography */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Selected Bibliography
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {artifact.bibliography.map((reference, index) => (
                    <li key={index} className="text-sm text-muted-foreground">{reference}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArtifactDetail;
