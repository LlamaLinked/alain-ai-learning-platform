import { tutorialsDB } from "./db";
import type { Context } from "encore.dev/api";

export async function logStepChange(opts: {
  ctx?: Context;
  tutorialId: number;
  stepId?: number;
  changeType: 'create' | 'update' | 'delete' | 'reorder';
  snapshot?: {
    step_order?: number;
    title?: string;
    content?: string;
    code_template?: string | null;
    expected_output?: string | null;
    model_params?: any;
  };
}) {
  const changedBy = (opts.ctx as any)?.meta?.userId ?? null;
  // Increment tutorial version and insert version row atomically
  const tx = await tutorialsDB.begin();
  try {
    const v = await tx.queryRow<{ version: number }>`
      UPDATE tutorials SET version = version + 1, updated_at = NOW()
      WHERE id = ${opts.tutorialId}
      RETURNING version`;

    const version = v?.version ?? 1;
    await tx.exec`
      INSERT INTO tutorial_step_versions (step_id, tutorial_id, version, changed_by, change_type, step_order, title, content, code_template, expected_output, model_params)
      VALUES (${opts.stepId ?? null}, ${opts.tutorialId}, ${version}, ${changedBy}, ${opts.changeType}, ${opts.snapshot?.step_order ?? null}, ${opts.snapshot?.title ?? null}, ${opts.snapshot?.content ?? null}, ${opts.snapshot?.code_template ?? null}, ${opts.snapshot?.expected_output ?? null}, ${opts.snapshot?.model_params ?? null})`;

    await tx.commit();
  } catch (e) {
    await tx.rollback();
    // best-effort logging; swallow errors to not block main flow
  }
}

