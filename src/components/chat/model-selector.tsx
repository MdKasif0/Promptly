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

export function ModelSelector({ model, setModel }: ModelSelectorProps) {
  return (
    <Select value={model} onValueChange={(value) => setModel(value as ModelId)}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
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
