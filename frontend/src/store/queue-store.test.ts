// Ambient declarations for test runner globals to prevent compilation errors
// biome-ignore lint/suspicious/noExplicitAny: test runner globals
declare const describe: any;
// biome-ignore lint/suspicious/noExplicitAny: test runner globals
declare const it: any;
// biome-ignore lint/suspicious/noExplicitAny: test runner globals
declare const expect: any;
// biome-ignore lint/suspicious/noExplicitAny: test runner globals
declare const beforeEach: any;

import { useQueueStore } from "./queue-store";

describe("Queue Store", () => {
  beforeEach(() => {
    useQueueStore.getState().clearQueue();
  });

  it("should initialize with empty tokens on clearQueue", () => {
    const state = useQueueStore.getState();
    expect(state.tokens).toEqual([]);
    expect(state.servingToken).toBe("A-128");
  });

  it("should add a new token correctly", () => {
    useQueueStore
      .getState()
      .addToken("Kenji Sato", "General Medicine - Dr. S. Tanaka", "Routine");
    const state = useQueueStore.getState();
    expect(state.tokens.length).toBe(1);
    expect(state.tokens[0].patientName).toBe("Kenji Sato");
    expect(state.tokens[0].status).toBe("Waiting");
  });

  it("should serve a token from waitlist", () => {
    useQueueStore
      .getState()
      .addToken("Yuki Mori", "Cardiology - Dr. H. Watanabe", "Urgent");
    const addedState = useQueueStore.getState();
    const token = addedState.tokens[0];

    useQueueStore.getState().serveToken(token);
    const servedState = useQueueStore.getState();
    expect(servedState.servingToken).toBe(token.token);
    expect(servedState.tokens.length).toBe(0);
  });
});
