// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  Configuration,
  CreateCompletionResponse,
  CreateCompletionRequest,
  OpenAIApi,
  CreateModerationRequest,
  CreateModerationRequestInput,
} from "openai";
type Data = {
  name: string;
};

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ data: CreateCompletionResponse } | { error: unknown }>
) {
  const { from, to, code } = req.body;
  const prompt = `Convert this code: ${code} from is in ${from} to ${to} \n`;
  try {
    const moderationRequest: CreateModerationRequest = {
      input: prompt as CreateModerationRequestInput
    };
    const completionRequest: CreateCompletionRequest = {
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 500,
    };

    const {data: moderation} = await openai.createModeration(moderationRequest);
    if(moderation.results.some(r => r.flagged === true)) {
      return res.send({
        error: 'The prompt contains offensive language'
      });
    }

    const {data: completion} = await openai.createCompletion(completionRequest);
    res.send({
      data: completion,
    });
  } catch (err) {
    console.log("error", err);
    res.send({
      error: err,
    });
  }
}
