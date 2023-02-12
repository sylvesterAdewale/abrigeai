import { Configuration, OpenAIApi } from "openai";
import { NextApiRequest, NextApiResponse } from "next";
import { tokenToString } from "typescript";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration);

export default async function generate(req: NextApiRequest, res: NextApiResponse) {
    if (!configuration.apiKey) {
        return res.status(500).json({
            error: "My bad, please wait a little while and try again"
        })
    }

    const article = req.body.article || ''
    if (article.trim().length === 0 ) {
        res.status(400).json({
            status: 'error',
            error: "Please enter an article"
        });
        return;
    }

    const token = req.body.token || 100
    if (token > 500) {
        res.status(400).json({
            status: 'error',
            error: "Max-Words can not exceed 500"
        })
        return;
    }

    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: mainPrompt(article),
            temperature: 0.7,
            max_tokens: token,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 1
        });
        res.status(200).json({status: 'success', result: completion.data.choices[0].text});
    } catch (error: any) {
        console.log(error);
        if (error.response) {
            console.error(error.response.status, error.response.data);
            res.status(error.response.status).json({status: 'error', error: error.response.data});
          } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            res.status(500).json({
                status: 'error',
                error: {
                    message: 'An error occurred during your request.',
                }
            });
        }
    }
    
}

function mainPrompt(article: string) {
    return `${article} \n\nTl;dr`
}