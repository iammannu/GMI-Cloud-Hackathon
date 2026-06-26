import { useState, useEffect } from "react";
import { fetchModels } from "@/services/api";
import type { GmiModel } from "@/types";

export function useModels() {
  const [models, setModels] = useState<GmiModel[]>([]);
  const [defaultModel, setDefaultModel] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModels()
      .then(({ models, default: def }) => {
        setModels(models);
        setDefaultModel(def);
        const saved = localStorage.getItem("launchpilot_model");
        setSelectedModel(saved && models.find((m) => m.id === saved) ? saved : def);
      })
      .catch(() => {
        const fallback = "meta-llama/Llama-3.3-70B-Instruct";
        setDefaultModel(fallback);
        setSelectedModel(fallback);
        setModels([
          {
            id: fallback,
            name: "Llama 3.3 70B",
            provider: "Meta",
            description: "Meta's flagship model",
            context_window: 131072,
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const selectModel = (id: string) => {
    setSelectedModel(id);
    localStorage.setItem("launchpilot_model", id);
  };

  return { models, defaultModel, selectedModel, selectModel, loading };
}
