import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Leaf, Bug, AlertTriangle } from "lucide-react";

const DISEASES_AND_PESTS = [
      {
        category: "Diseases",
        icon: AlertTriangle,
        items: [
          {
            name: "Rosette",
            symptoms: "Yellow mosaic patterns on leaves, stunted growth",
            treatment: "Use virus-resistant varieties, control aphids, remove infected plants",
          },
      {
        name: "Leaf Spots (Early & Late)",
        symptoms: "Brown circular spots on leaves, premature defoliation",
        treatment: "Rotate crops, use fungicides (chlorothalonil), improve drainage",
      },
      {
        name: "Rust",
        symptoms: "Reddish-brown pustules on leaf undersides",
        treatment: "Plant resistant varieties, fungicide spray (sulfur or copper), remove debris",
      },
      {
        name: "Aflatoxin (Aspergillus)",
        symptoms: "Mold on pods during storage, no field symptoms",
        treatment: "Dry pods to <10% moisture, store in cool dry place, use lime/charcoal",
      },
    ],
  },
      {
        category: "Pests",
        icon: Bug,
        items: [
          {
            name: "Jassid",
            symptoms: "Yellowing leaves, stunted growth, fine webbing",
            treatment: "Spray insecticide, introduce parasitic wasps, use neem oil",
          },
      {
        name: "Thrips",
        symptoms: "Silvery streaks on leaves, pod discoloration",
        treatment: "Use sticky traps, spray with spinosad or neem oil",
      },
      {
        name: "Pod Borers",
        symptoms: "Holes in pods, damaged kernels",
        treatment: "Timely harvesting, use pheromone traps, Bt spray",
      },
      {
        name: "Termites",
        symptoms: "Underground damage to roots and pods",
        treatment: "Crop rotation, soil treatment with termiticide, use resistant varieties",
      },
    ],
  },
  {
    category: "Best Practices",
    icon: Leaf,
    items: [
      {
        name: "Crop Rotation",
        symptoms: "Reduces disease pressure and soil depletion",
        treatment: "Rotate with legumes or cereals; avoid same family for 2-3 years",
      },
      {
        name: "Soil Preparation",
        symptoms: "Poor yield, nutrient deficiency",
        treatment: "Test soil pH (6.0-7.0), add compost, ensure good drainage",
      },
      {
        name: "Irrigation",
        symptoms: "Drought stress, pod fill issues",
        treatment: "Water 40-50mm total; critical during flowering and pod fill",
      },
    ],
  },
];

interface DiseaseKBProps {
  // optional callback to insert KB info into chat
  onSelectItem?: (category: string, item: any) => void;
}

export const DiseaseKnowledgeBase = ({ onSelectItem }: DiseaseKBProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = DISEASES_AND_PESTS.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.symptoms.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter((section) => section.items.length > 0);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search diseases, pests, practices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-6">
          {filteredItems.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              No results found. Try a different search term.
            </p>
          ) : (
            filteredItems.map((section) => {
              const IconComponent = section.icon;
              return (
                <div key={section.category}>
                  <div className="flex items-center gap-2 mb-3">
                    <IconComponent className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-sm">{section.category}</h3>
                  </div>
                  <div className="space-y-3">
                    {section.items.map((item, idx) => (
                      <Card
                        key={idx}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => onSelectItem?.(section.category, item)}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">{item.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Symptoms:</p>
                            <p className="text-xs">{item.symptoms}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Treatment/Action:</p>
                            <p className="text-xs">{item.treatment}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
