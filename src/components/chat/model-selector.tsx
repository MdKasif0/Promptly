
"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MODEL_DATA, type ModelId } from "@/lib/models";

interface ModelSelectorProps {
  model: ModelId;
  setModel: (model: ModelId) => void;
}

const PremiumSparklesIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sparkles-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: '#A0D2F8', stopOpacity: 1}} />
        <stop offset="50%" style={{stopColor: '#A0A0F8', stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: '#F8A0F8', stopOpacity: 1}} />
      </linearGradient>
    </defs>
    <path d="M12 2.25L13.125 5.625L16.5 6.75L13.125 7.875L12 11.25L10.875 7.875L7.5 6.75L10.875 5.625L12 2.25Z" fill="url(#sparkles-gradient)"/>
    <path d="M5.25 8.25L6.04687 10.125L7.875 10.875L6.04687 11.625L5.25 13.5L4.45313 11.625L2.625 10.875L4.45313 10.125L5.25 8.25Z" fill="url(#sparkles-gradient)"/>
    <path d="M18.75 13.5L17.9531 15.375L16.125 16.125L17.9531 16.875L18.75 18.75L19.5469 16.875L21.375 16.125L19.5469 15.375L18.75 13.5Z" fill="url(#sparkles-gradient)"/>
    <path d="M12 15.75L13.125 19.125L16.5 20.25L13.125 21.375L12 24.75L10.875 21.375L7.5 20.25L10.875 19.125L12 15.75Z" fill="url(#sparkles-gradient)" opacity="0.6"/>
  </svg>
);


export function ModelSelector({ model, setModel }: ModelSelectorProps) {
  const selectedModelData = Object.values(MODEL_DATA).flatMap(c => c.models).find(m => m.id === model);

  return (
    <Select value={model} onValueChange={(value) => setModel(value as ModelId)}>
      <SelectTrigger className="w-auto h-auto bg-transparent border-none focus:ring-0 focus:ring-offset-0 gap-2 px-3 py-1.5 rounded-full hover:bg-muted/50">
        <PremiumSparklesIcon />
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent className="max-h-[80vh]">
        <TooltipProvider delayDuration={100}>
          {Object.entries(MODEL_DATA).map(([categoryId, category]) => (
            <SelectGroup key={categoryId}>
              <SelectLabel>{category.label}</SelectLabel>
              {category.models.map((m) => (
                <Tooltip key={m.id}>
                  <TooltipTrigger asChild>
                    <SelectItem value={m.id}>{m.name}</SelectItem>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="font-bold">{m.name}</p>
                    <p className="text-sm text-muted-foreground mb-1">
                      <span className="font-semibold text-foreground">Category: </span>{category.label}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {m.description}
                    </p>
                    <div className="mt-2 flex gap-2">
                      {m.capabilities.map((cap) => (
                        <span key={cap} className="px-2 py-0.5 text-xs bg-secondary rounded-full">
                          {cap}
                        </span>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </SelectGroup>
          ))}
        </TooltipProvider>
      </SelectContent>
    </Select>
  );
}
