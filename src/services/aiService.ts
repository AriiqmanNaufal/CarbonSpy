import openai from '../config/openai';
import redisClient from '../config/redis';
import logger from '../utils/logger';

interface ProductData {
  name?: string;
  description?: string;
  materials?: string[];
  packaging?: string[];
  logistics?: string[];
}

interface AnalysisResult {
  productName: string;
  material: string;
  packaging: string;
  logistics: string;
  estimatedCO2: number;
  comparisonToIndustryAvg: string;
  suggestions: string[];
}

const AI_CACHE_KEY_PREFIX = 'ai-analysis:';
const CACHE_EXPIRATION = 3600; // 1 hour

export const analyzeProduct = async (data: ProductData): Promise<AnalysisResult> => {
  const cacheKey = `${AI_CACHE_KEY_PREFIX}${JSON.stringify(data)}`;

  try {
    const cachedResult = await redisClient.get(cacheKey);
    if (cachedResult) {
      logger.info('Returning cached AI analysis');
      return JSON.parse(cachedResult);
    }
  } catch (error) {
    logger.error('Redis cache read error:', error);
  }

  const prompt = `
    Analyze the following product information to estimate its carbon footprint.
    Product Name: ${data.name}
    Description: ${data.description}
    Materials Mentioned: ${data.materials?.join(', ')}
    Packaging Information: ${data.packaging?.join(', ')}
    Logistics Hints: ${data.logistics?.join(', ')}

    Based on this, provide a JSON object with the following structure:
    {
      "productName": "...",
      "material": "Categorize the primary material (e.g., Recycled Plastic, Organic Cotton, Aluminum).",
      "packaging": "Describe the likely packaging (e.g., Cardboard box, Plastic wrap).",
      "logistics": "Infer the logistics chain (e.g., Shipped from Asia, Local delivery).",
      "estimatedCO2": "Estimate the CO2 emissions in kg. Be realistic.",
      "comparisonToIndustryAvg": "Compare the estimate to the industry average for this product type (e.g., 'Lower than average', 'Higher than average').",
      "suggestions": ["Provide 2-3 actionable suggestions for reducing the carbon footprint."]
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}') as AnalysisResult;

    await redisClient.setex(cacheKey, CACHE_EXPIRATION, JSON.stringify(result));
    logger.info('AI analysis completed and cached');

    return result;
  } catch (error) {
    logger.error('Error with OpenAI API:', error);
    throw new Error('Failed to get analysis from OpenAI');
  }
};
