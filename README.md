# ddc-treesitter

Treesitter completion for ddc.vim **(experimental)**

This source collects candidates from [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter).

## Required

### denops.vim

https://github.com/vim-denops/denops.vim

### ddc.vim

https://github.com/Shougo/ddc.vim

### nvim-treesitter

https://github.com/nvim-treesitter/nvim-treesitter

## Configuration

```vim
" Use treesitter source.
call ddc#custom#patch_global('sources', ['treesitter'])

" Change source options
call ddc#custom#patch_global('sourceOptions', {
      \ 'treesitter': {'mark': 'T'},
      \ })
```
