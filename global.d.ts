import github from "@actions/github";
import {
	OctokitResponse,
	ActionsGetWorkflowResponseData,
	ActionsGetWorkflowRunResponseData,
} from "@octokit/types";

declare global {
	type GitHubClient = ReturnType<typeof github.getOctokit>;
	type GitHubContext = typeof github.context;
	type GitHubRepo = GitHubContext["repo"];

	type WorkflowData = ActionsGetWorkflowResponseData;
	type WorkflowRunData = ActionsGetWorkflowRunResponseData;
	type WorkflowRunsAsyncIterator = AsyncIterableIterator<
		OctokitResponse<WorkflowRunData[]>
	>;

	interface Inputs {
		workflow?: string;
		artifact: string;
		path?: string;
	}
}
