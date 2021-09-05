import { Denops, fn } from "https://deno.land/x/ddc_vim@v0.5.0/deps.ts#^";
import {
  BaseSource,
  Candidate,
} from "https://deno.land/x/ddc_vim@v0.5.0/types.ts#^";
import {
  GatherCandidatesArguments,
  OnInitArguments,
} from "https://deno.land/x/ddc_vim@v0.5.0/base/source.ts#^";
import * as nvim from "https://deno.land/x/denops_std@v1.8.1/function/nvim/mod.ts#^";

export class Source extends BaseSource {
  private available = false;

  async onInit({ denops }: OnInitArguments): Promise<void> {
    if (!(await fn.has(denops, "nvim-0.5"))) {
      await this.print_error(denops, "This source needs Neovim >=0.5.0");
      return;
    }
    this.available = true;
  }

  async gatherCandidates({
    denops,
  }: GatherCandidatesArguments): Promise<Candidate[]> {
    return nvim.nvim_execute_lua(denops, "return require'ddc-treesitter'.gather_candidates()", null) as Promise<Candidate[]>
  }

  private async print_error(denops: Denops, message: string): Promise<void> {
    await denops.call("ddc#util#print_error", message, "ddc-ctags")
  }
}
