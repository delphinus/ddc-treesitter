local M = {}

M.gather_items = function()
  local candidates = {}
  local ok, parser = pcall(vim.treesitter.get_parser)
  if not ok then
    return candidates
  end
  local query = vim.treesitter.query.get(parser:lang(), "highlights")
  if not query then
    return candidates
  end
  for _, tree in pairs(parser:parse()) do
    for i, node in query:iter_captures(tree:root(), 0) do
      local parent = node:parent()
      local grandparent = parent and parent:parent() or nil
      local word = vim.treesitter.get_node_text(node, 0)
      if word then
        table.insert(candidates, {
          word = word,
          kind = query.captures[i],
          parent = parent and vim.treesitter.get_node_text(parent, 0) or nil,
          grandparent = grandparent and vim.treesitter.get_node_text(grandparent, 0) or nil,
        })
      end
    end
  end
  return candidates
end

return M
