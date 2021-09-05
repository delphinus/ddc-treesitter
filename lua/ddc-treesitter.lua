local M = {}

M.gather_candidates = function()
  local ok, parser = pcall(vim.treesitter.get_parser)
  if not ok then return {} end
  local candidates = {}
  for _, tree in pairs(parser:parse()) do
    local query = vim.treesitter.get_query(parser:lang(), 'Highlights')
    for i, node in query:iter_captures(tree:root(), 0) do
      local parent = node:parent()
      local grandparent = parent and parent:parent() or nil
      local word = vim.treesitter.get_node_text(node, 0)
      if word then
        local menu = nil
        if parent then
          local text = vim.treesitter.get_node_text(parent, 0)
          if text then menu = '← '..text end
        end
        if grandparent and menu then
          local text = vim.treesitter.get_node_text(grandparent, 0)
          if text then menu = menu..' ← '..text end
        end
        table.insert(candidates, {
          word = word,
          kind = query.captures[i],
          menu = menu,
        })
      end
    end
  end
  return candidates
end

return M
