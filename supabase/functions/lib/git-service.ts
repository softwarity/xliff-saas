import { GhEstimateInputs, GhTranslateInputs } from "../models/gh-action-inputs.ts";

export function launchEstimateRunner(inputs: GhEstimateInputs): Promise<void> {
  return launchXliffRunner('estimate.yml', inputs);
}

export function launchTranslateRunner(inputs: GhTranslateInputs): Promise<void> {
  return launchXliffRunner('translate.yml', inputs);
}

export async function launchXliffRunner(workflowId: string, inputs: GhTranslateInputs | GhEstimateInputs): Promise<void> {
  const response = await fetch(`https://api.github.com/repos/softwarity/xliff-runner/actions/workflows/${workflowId}/dispatches`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${Deno.env.get('GITHUB_TOKEN')}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ref: 'main', inputs }),
  });
  if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
  }
  return Promise.resolve();
}
