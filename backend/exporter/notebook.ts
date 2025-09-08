export type Notebook = {
  cells: Array<
    | { cell_type: "markdown"; metadata: object; source: string[] }
    | { cell_type: "code"; metadata: object; source: string[]; outputs: any[]; execution_count: number | null }
  >;
  metadata: Record<string, any>;
  nbformat: number;
  nbformat_minor: number;
};

export function buildNotebook(
  title: string,
  description: string,
  steps: Array<{ step_order: number; title: string; content: string; code_template: string | null }>
): Notebook {
  const cells: Notebook["cells"] = [];
  cells.push({
    cell_type: "markdown",
    metadata: {},
    source: [
      `# ${title}\n`,
      "\n",
      `${description}\n`,
      "\n",
      "This notebook was generated from a tutorial.\n",
    ],
  });

  for (const s of steps.sort((a, b) => a.step_order - b.step_order)) {
    cells.push({
      cell_type: "markdown",
      metadata: {},
      source: [`## ${s.title}\n`, "\n", s.content.endsWith("\n") ? s.content : s.content + "\n"],
    });
    if (s.code_template) {
      cells.push({
        cell_type: "code",
        metadata: {},
        source: [s.code_template.endsWith("\n") ? s.code_template : s.code_template + "\n"],
        outputs: [],
        execution_count: null,
      });
    }
  }

  return {
    cells,
    metadata: {
      kernelspec: { display_name: "Python 3", language: "python", name: "python3" },
      language_info: { name: "python" },
    },
    nbformat: 4,
    nbformat_minor: 5,
  };
}

