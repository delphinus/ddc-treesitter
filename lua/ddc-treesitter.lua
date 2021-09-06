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
        table.insert(candidates, {
          word = word,
          kind = query.captures[i],
          parent = parent and vim.treesitter.get_node_text(parent, 0) or nil,
          grandparent = grandparent and
            vim.treesitter.get_node_text(grandparent, 0) or nil,
        })
      end
    end
  end
  return candidates
end

return M
