import { Client as WorkflowClient } from "@upstash/workflow";
import { QSTASH_URL, QSTASH_TOKEN, QSTASH_CURRENT_SIGNING_KEY, QSTASH_NEXT_SIGNING_KEY } from "./env.js";   

export const WorkflowClient = new WorkflowClient({
    url: QSTASH_URL,
    token: QSTASH_TOKEN,
    currentSigningKey: QSTASH_CURRENT_SIGNING_KEY,
    nextSigningKey: QSTASH_NEXT_SIGNING_KEY
});

export default WorkflowClient;
