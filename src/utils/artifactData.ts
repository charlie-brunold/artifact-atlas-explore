
import { useTranslation } from 'react-i18next';

export interface Artifact {
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

// Base artifact data with static information
export const baseArtifacts = [
  {
    id: 1,
    imageUrl: "/img/artifacts/paracas_textile.jpg",
    accessionNumber: "AM-TX-001",
    dateAcquired: "1958-03-15",
    exhibitions: ["Paracas: Ancient Textiles of Peru, 1992", "Colors of the Andes, 2005"],
    bibliography: ["Paul, A. Paracas Ritual Attire: Symbols of Authority in Ancient Peru. University of Oklahoma Press, 1990.", "Townsend, R. F. The Ancient Americas: Art from Sacred Landscapes. Art Institute of Chicago, 1992."]
  },
  {
    id: 2,
    imageUrl: "/img/artifacts/huari_vessel.jpg",
    accessionNumber: "MNA-CR-002",
    dateAcquired: "1965-11-22",
    exhibitions: ["Huari: Empire of the Andes, 2008", "Art and Cosmos in the Ancient Andes, 2015"],
    bibliography: ["Isbell, W. H., & McEwan, G. F. (Eds.). Huari Administrative Structure: Prehistoric Monumental Architecture and State Government. Dumbarton Oaks Research Library and Collection, 1991.", "Nash, D. J. (Ed.). The Oxford Handbook of Andean Archaeology. Oxford University Press, 2013."]
  },
  {
    id: 3,
    imageUrl: "/img/artifacts/chimu_headdress.jpg",
    accessionNumber: "MDOP-OR-003",
    dateAcquired: "1972-06-01",
    exhibitions: ["Splendors of the Chimú Empire, 1995", "Gold of the Andes, 2007"],
    bibliography: ["Conrad, G. W. Religion and Empire: The Dynamics of Aztec and Inca Expansion. Cambridge University Press, 1984.", "Quilter, J. The Ancient Central Andes. Routledge, 2014."]
  },
  {
    id: 4,
    imageUrl: "/img/artifacts/inca_kero.jpg",
    accessionNumber: "MI-KE-004",
    dateAcquired: "1980-09-10",
    exhibitions: ["Inca: Lords of Gold and Glory, 2000", "The Power of the Incas, 2010"],
    bibliography: ["D'Altroy, T. N. The Incas. Blackwell Publishing, 2002.", "Covey, R. A. How the Incas Built Their Heartland: State Formation and the Innovation of Imperial Strategies in the Sacred Valley, Peru. University of Michigan Press, 2019."]
  },
  {
    id: 5,
    imageUrl: "/img/artifacts/nazca_textile.jpg",
    accessionNumber: "MAA-TX-005",
    dateAcquired: "1988-04-01",
    exhibitions: ["Nazca: Decoding the Desert, 2003", "Weaving the World: Textile Art of Ancient Peru, 2012"],
    bibliography: ["Silverman, H., & Proulx, D. The Nasca. Blackwell Publishers, 2002.", "Aveni, A. Nasca: Eighth Wonder of the World. British Museum Press, 2000."]
  },
  {
    id: 6,
    imageUrl: "/img/artifacts/chancay_doll.jpg",
    accessionNumber: "MTP-TX-006",
    dateAcquired: "1990-07-15",
    exhibitions: ["Chancay: Textiles and Pottery, 2005", "Daily Life in Ancient Peru, 2014"],
    bibliography: ["d'Harcourt, R. Textiles of Ancient Peru and Their Techniques. University of Washington Press, 1962.", "Frame, M. Andean Four-Cornered Hats: Ancient Symbols. Thames & Hudson, 2005."]
  }
];

export const useTranslatedArtifacts = (): Artifact[] => {
  const { t } = useTranslation();

  return baseArtifacts.map(artifact => ({
    ...artifact,
    title: t(`artifacts.${artifact.id}.title`),
    category: t(`artifacts.${artifact.id}.category`),
    period: t(`artifacts.${artifact.id}.period`),
    culture: t(`artifacts.${artifact.id}.culture`),
    material: t(`artifacts.${artifact.id}.material`),
    dimensions: t(`artifacts.${artifact.id}.dimensions`),
    location: t(`artifacts.${artifact.id}.location`),
    description: t(`artifacts.${artifact.id}.description`),
    provenance: t(`artifacts.${artifact.id}.provenance`),
    significance: t(`artifacts.${artifact.id}.significance`),
    condition: t(`artifacts.${artifact.id}.condition`)
  }));
};
