import { GhInputs } from "../models/gh-action-inputs.ts";

export function launchEstimateRunner(inputs: GhInputs): Promise<void> {
  return launchXliffRunner('estimate.yml', inputs);
}

export function launchTranslateRunner(inputs: GhInputs): Promise<void> {
  return launchXliffRunner('translate.yml', inputs);
}

export async function cancelRun(runId: string): Promise<void> {
  const response = await fetch(`https://api.github.com/repos/softwarity/xliff-runner/actions/runs/${runId}/cancel`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${Deno.env.get('GITHUB_TOKEN')}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
    }
  });
  if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
  }
  return Promise.resolve();
}

export async function launchXliffRunner(workflowId: string, inputs: GhInputs): Promise<void> {
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
      return Promise.reject(error);
  }
  return Promise.resolve();
}
