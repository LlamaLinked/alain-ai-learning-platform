import { api, APIError } from "encore.dev/api";
import { tutorialsDB } from "../tutorials/db";
import { requireUserId } from "../auth";

interface AnalyticsRequest {
  tutorialId?: number;
}

interface TutorialAnalytics {
  tutorialId: number;
  title: string;
  usersStarted: number;
  usersCompleted: number;
  avgCompletionPercent: number; // 0-100
  lastAccessedMax?: string;
}

// Provides aggregate progress analytics per tutorial or for a specific tutorial.
export const analytics = api<AnalyticsRequest, TutorialAnalytics[]>(
  { expose: true, method: "GET", path: "/progress/analytics" },
  async (req, ctx) => {
    await requireUserId(ctx);

    // If a specific tutorial requested, validate it exists
    if (req.tutorialId !== undefined) {
      if (req.tutorialId < 1) throw APIError.invalidArgument("tutorialId must be positive");
      const t = await tutorialsDB.queryRow`SELECT id, title FROM tutorials WHERE id = ${req.tutorialId}`;
      if (!t) throw APIError.notFound("tutorial not found");
    }

    // Compute completion: users with current_step >= max step and include all steps in completed_steps
    const rows = await tutorialsDB.queryAll<{
      tutorial_id: number;
      title: string;
      users_started: number;
      users_completed: number;
      avg_completion: number;
      last_accessed_max: string | null;
    }>`
      WITH per_tut AS (
        SELECT t.id AS tutorial_id,
               t.title,
               (SELECT COUNT(*) FROM user_progress up WHERE up.tutorial_id = t.id) AS users_started,
               (SELECT COUNT(*) FROM user_progress up WHERE up.tutorial_id = t.id AND up.current_step >= (
                  SELECT COALESCE(MAX(step_order), 0) FROM tutorial_steps s WHERE s.tutorial_id = t.id
               )) AS users_completed,
               (SELECT COALESCE(AVG(
                  CASE 
                    WHEN max_steps = 0 THEN 0
                    ELSE LEAST(100, GREATEST(0, (current_step::decimal / max_steps) * 100))
                  END
               ), 0)
                FROM (
                  SELECT up.current_step, COALESCE((SELECT MAX(step_order) FROM tutorial_steps s WHERE s.tutorial_id = t.id), 0) AS max_steps
                  FROM user_progress up WHERE up.tutorial_id = t.id
                ) z) AS avg_completion,
               (SELECT TO_CHAR(MAX(up.last_accessed), 'YYYY-MM-DD"T"HH24:MI:SSZ') FROM user_progress up WHERE up.tutorial_id = t.id) AS last_accessed_max
        FROM tutorials t
        ${req.tutorialId !== undefined ? tutorialsDB.raw`WHERE t.id = ${req.tutorialId}` : tutorialsDB.raw``}
      )
      SELECT * FROM per_tut
      ORDER BY tutorial_id ASC
    `;

    return rows.map(r => ({
      tutorialId: r.tutorial_id,
      title: r.title,
      usersStarted: Number(r.users_started || 0),
      usersCompleted: Number(r.users_completed || 0),
      avgCompletionPercent: Number(r.avg_completion || 0),
      lastAccessedMax: r.last_accessed_max || undefined,
    }));
  }
);

