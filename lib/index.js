/**
 * @param {GitHubClient} client
 * @param {GitHubContext} context
 * @param {number} run_id
 */
export async function getWorkflowIdFromRunId(client, context, run_id) {
	const res = await client.actions.getWorkflowRun({ ...context.repo, run_id });
	return res.data.workflow_id;
}

/**
 * @param {GitHubClient} client
 * @param {GitHubContext} context
 * @param {string} file
 */
export async function getWorkflowIdFromFile(client, context, file) {
	try {
		const res = await client.actions.getWorkflow({
			...context.repo,
			workflow_id: file,
		});
		return res.data.id;
	} catch (e) {
		if (e.status == 404) {
			throw new Error(
				`Could not find workflow using file "${file}".\n\nFull request error details:\n${e}`
			);
		} else {
			throw e;
		}
	}
}

/**
 * @param {GitHubClient} client
 * @param {GitHubRepo} repo
 * @param {number} workflow_id
 * @param {string} commit
 * @param {string} [ref]
 * @returns {Promise<WorkflowRunData | null>}
 */
export async function getWorkflowRunForCommit(
	client,
	repo,
	workflow_id,
	commit,
	ref
) {
	// https://docs.github.com/en/rest/reference/actions#list-workflow-runs
	const endpoint = client.actions.listWorkflowRuns.endpoint({
		...repo,
		workflow_id,
		status: "success",
		branch: ref ? ref.replace(/^refs\/heads\//, "") : undefined,
	});

	/** @type {WorkflowRunsAsyncIterator} */
	const iterator = client.paginate.iterator(endpoint);

	let run = null;
	for await (const runs of iterator) {
		run = runs.data.find((run) => run.head_sha == commit);
		if (run) {
			break;
		}
	}

	return run;
}
