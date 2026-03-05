export interface DiagnosisResult {
  possibleConditions: {
    name: string;
    likelihood: "Low" | "Moderate" | "High";
    description: string;
  }[];
  precautions: string[];
  advice: string;
  urgency: "Routine" | "Urgent" | "Emergency";
}

export async function analyzeSymptoms(symptoms: string): Promise<DiagnosisResult> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ symptoms }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to analyze symptoms");
  }

  return await response.json();
}
