export type ProjectVisualState = {
  id: string;
  name: string;
  shortName: string;
  type: string;
  value: string;
  status: "In Progress";
  progress: number;
  nextAction: string;
};

export const progressSteps = [0, 10, 20, 40, 60, 80, 100] as const;

export const montostalProject: Omit<ProjectVisualState, "progress"> = {
  id: "montostal-website-redesign",
  name: "Website Redesign",
  shortName: "MONTOSTAL",
  type: "Website / Client Project",
  value: "3,900 PLN",
  status: "In Progress",
  nextAction: "Send / follow up on proposal",
};
