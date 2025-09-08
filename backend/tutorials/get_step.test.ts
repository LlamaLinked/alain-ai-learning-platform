import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getStep } from "./get_step";
import { tutorialsDB } from "./db";

vi.mock("../auth", () => ({
  requireUserId: vi.fn().mockResolvedValue("test-user"),
}));

describe("getStep", () => {
  let tutorialId: number;
  let stepId: number;

  beforeEach(async () => {
    const tut = await tutorialsDB.queryRow<{ id: number }>`
      INSERT INTO tutorials (title, description, model, provider, difficulty, tags)
      VALUES ('T', 'D', 'm', 'p', 'beginner', ARRAY['x'])
      RETURNING id`;
    tutorialId = tut!.id;
    const step = await tutorialsDB.queryRow<{ id: number }>`
      INSERT INTO tutorial_steps (tutorial_id, step_order, title, content)
      VALUES (${tutorialId}, 1, 'Step 1', 'Content 1')
      RETURNING id`;
    stepId = step!.id;
  });

  afterEach(async () => {
    await tutorialsDB.exec`DELETE FROM tutorials WHERE id = ${tutorialId}`;
  });

  it("returns the specific step by id", async () => {
    const s = await getStep({ stepId });
    expect(s.id).toBe(stepId);
    expect(s.title).toBe("Step 1");
  });

  it("throws for missing step", async () => {
    await expect(getStep({ stepId: 999999 })).rejects.toThrow();
  });
});

