import { GardenProfileData, CropEvaluation } from '../types';
import { getApiUrl } from './apiConfig';

export interface AIExplanationResult {
  success: boolean;
  content: string;
  engineUsed: string;
  errorMessage?: string;
  promptSent?: string;
}

export const aiProviderService = {
  async generateExplanation(
    profile: GardenProfileData,
    suitableCrops: CropEvaluation[],
    providerType: 'offline' | 'gemma' | 'gemini'
  ): Promise<AIExplanationResult> {
    const selected = suitableCrops.slice(0, 4);

    const cropsFactsText = selected
      .map(
        (e) =>
          `- ${e.crop.common_name} (${e.crop.botanical_name}): Requires ${e.crop.min_sunlight_hours}h sun, ${e.crop.min_space_sq_ft} sq ft, ${e.crop.min_container_depth_inches}" root depth. Matures in ${e.crop.days_to_maturity} days. Guidance: ${e.crop.care_guidance}`
      )
      .join('\n');

    const prompt = `GARDEN PROFILE:
Location: ${profile.location}
Garden Type: ${profile.gardenType}
Sunlight: ${profile.sunlight}
Area: ${profile.growingSpaceSqFt} sq ft
Experience: ${profile.experienceLevel}

VERIFIED SUITABLE CROPS:
${cropsFactsText}

TASK:
Explain why these crops suit this layout and provide 3 practical outdoor next steps to get outside and touch grass.`;

    // 1. Offline Grounded Synthesizer
    if (providerType === 'offline') {
      const cropList = selected.map((s) => s.crop.common_name).join(', ');
      const content = `### 🌱 Grounded Outdoor Gardening Strategy: ${profile.location}

Your **${profile.growingSpaceSqFt} sq ft ${profile.gardenType}** setup receives **${profile.sunlight.replace('_', ' ')}** conditions.

The deterministic rules engine verified **${cropList}** as suitable crops for your space based on root depth, sunlight thresholds, and temperature tolerance.

#### 🔬 Verified Horticultural Rationale:
${selected
  .map(
    (e) =>
      `- **${e.crop.common_name}** (*${e.crop.botanical_name}*): Needs ${e.crop.min_sunlight_hours}h direct sun (you have ${profile.sunlight.replace('_', ' ')}). Requires at least ${e.crop.min_container_depth_inches}" soil depth. *${e.crop.care_guidance}*`
  )
  .join('\n')}

#### 🌿 3 Practical Outdoor Next Steps ("Touch Grass"):
1. **Soil Prep Outdoors**: Step outside to check container drainage holes. Standing water suffocates feeder roots.
2. **Moisture Finger Test**: Avoid watering on a timer. Push your finger 1 inch into the topsoil; only water when dry to the touch.
3. **Pinch Leaf Tips**: Pruning top growing tips on young herbs and greens encourages branching and increases your harvest by up to 30%.`;

      return {
        success: true,
        content,
        engineUsed: 'Offline Grounded Synthesizer (Zero LLM Overhead)',
        promptSent: prompt,
      };
    }

    // 2. Open-Weight Gemma (via local Ollama or OpenAI-compatible endpoint)
    if (providerType === 'gemma') {
      try {
        const ollamaRes = await fetch('http://localhost:11434/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'gemma2:2b',
            messages: [
              {
                role: 'system',
                content:
                  'You are GrowWise, a grounded horticultural AI assistant for Hacktoberfest Touch Grass. Never hallucinate botanical facts. Rely strictly on provided context.',
              },
              { role: 'user', content: prompt },
            ],
            temperature: 0.2,
          }),
        });

        if (ollamaRes.ok) {
          const data = await ollamaRes.json();
          const reply = data.choices?.[0]?.message?.content || '';
          return {
            success: true,
            content: reply,
            engineUsed: 'Local Open-Weight Gemma 2 2B (via Ollama)',
            promptSent: prompt,
          };
        }
      } catch {
        // Fallback gracefully if Ollama is not running
      }

      // If local Ollama is not active, return clear diagnostic with offline fallback
      return {
        success: true,
        content: `*(Note: Local Ollama endpoint at http://localhost:11434 was not detected. Generated using deterministic verified facts:)*\n\n` +
          selected.map((s) => `• **${s.crop.common_name}**: ${s.crop.care_guidance} (Matures in ${s.crop.days_to_maturity} days).`).join('\n\n') +
          `\n\nTo run Gemma locally, install Ollama and run \`ollama run gemma2:2b\`.`,
        engineUsed: 'Offline Fallback (Ollama Offline)',
        promptSent: prompt,
      };
    }

    // 3. Gemini Development Assistant
    try {
      const res = await fetch(getApiUrl('/api/ai-explain'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.success) {
        return {
          success: true,
          content: data.text,
          engineUsed: data.engine || 'Cloud Gemini 2.5 Flash Proxy',
          promptSent: prompt,
        };
      }
    } catch {
      // Fallback
    }

    // Default fallback
    return aiProviderService.generateExplanation(profile, suitableCrops, 'offline');
  },
};
