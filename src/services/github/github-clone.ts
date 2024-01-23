import { IClones } from "../../types";

export const GitHubClone = async (
  key: string | undefined,
  project: string,
): Promise<IClones | undefined> => {
  if (!key) throw new Error("no key or");
  const response = await fetch(
    `https://api.github.com/repos/lazywoodpeacker/${project}/traffic/clones`,
    {
      headers: {
        Authorization: "Bearer " + key,
      },
    },
  );
  if (response.status === 404) throw new Error("githubapi request notfound");
  if (!response.ok) throw new Error("wrong githubapi request");
  return await response.json();
};
