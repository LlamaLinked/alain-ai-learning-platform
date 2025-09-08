import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { listSteps } from "./list_steps";
import { tutorialsDB } from "./db";

vi.mock("../auth", () => ({
  requireUserId: vi.fn().mockResolvedValue("test-user"),
}));

describe("listSteps", () => {
  let tutorialId: number;

  beforeEach(async () => {
    const tut = await tutorialsDB.queryRow<{ id: number }>`
      INSERT INTO tutorials (title, description, model, provider, difficulty, tags)
      VALUES ('T', 'D', 'm', 'p', 'beginner', ARRAY['x'])
      RETURNING id`;
    tutorialId = tut!.id;
    await tutorialsDB.exec`
      INSERT INTO tutorial_steps (tutorial_id, step_order, title, content)
      VALUES (${tutorialId}, 1, 'Step 1', 'Content 1'),
             (${tutorialId}, 2, 'Step 2', 'Content 2')`;
  });

  afterEach(async () => {
    await tutorialsDB.exec`DELETE FROM tutorials WHERE id = ${tutorialId}`;
  });

  it("lists steps in order", async () => {
    const steps = await listSteps({ tutorialId });
    expect(steps.length).toBe(2);
    expect(steps[0].step_order).toBe(1);
    expect(steps[1].step_order).toBe(2);
  });

  it("throws for missing tutorial", async () => {
    await expect(listSteps({ tutorialId: 999999 })).rejects.toThrow();
  });
});

