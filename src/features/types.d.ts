export namespace YaGithubBot {
  interface IGithubClone {
    timestamp: string;
    count: number;
    uniques: number;
  }

  export interface IGithubClones {
    count: number;
    uniques: number;
    clones: IGithubClone[];
  }

  export interface IClone {
    id: string;
    lastdata: string;
    lastdate: string;
    watcherId: string;
  }

  export interface IGithubRepo {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    private: boolean;
  }

  export interface IGithubRepos {
    total_count: number;
    incomplete_results: boolean;
    items: IGithubRepo[];
  }
}
