import { Denops, fn } from "https://lib.deno.dev/x/ddc_vim@v4.3.1/deps.ts";
import {
  BaseSource,
  Item,
} from "https://lib.deno.dev/x/ddc_vim@v4.3.1/types.ts";
import {
  GatherArguments,
  OnInitArguments,
} from "https://lib.deno.dev/x/ddc_vim@v4.3.1/base/source.ts";

interface NodeInfo {
  word: string;
  kind: string;
  parent?: string;
  grandparent?: string;
}

type Params = Record<string, unknown>;

export class Source extends BaseSource<Params> {
  private available = false;

  async onInit({ denops }: OnInitArguments<Params>): Promise<void> {
    if (!(await fn.has(denops, "nvim-0.5"))) {
      await this.print_error(denops, "This source needs Neovim >=0.5.0");
      return;
    }
    this.available = true;
  }

  async gather({
    denops,
  }: GatherArguments<Params>): Promise<Item[]> {
    if (!this.available) {
      return [];
    }
    const nodeInfos = (await denops.call(
      "luaeval",
      "require'ddc-treesitter'.gather_items()",
    )) as NodeInfo[];
    return nodeInfos.map(({ word, kind, parent, grandparent }) => {
      const item: Item = { word, kind };
      if (grandparent) {
        item.menu = `→ ${grandparent}`;
      } else if (parent) {
        item.menu = `→ ${parent}`;
      }
      return item;
    });
  }

  params(): Params {
    return {};
  }

  private async print_error(denops: Denops, message: string): Promise<void> {
    await denops.call("ddc#util#print_error", message, "ddc-treesitter");
  }
}
