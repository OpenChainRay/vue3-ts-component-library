const fs = require("fs")
const path = require("path")

const root = path.resolve(__dirname, "examples")
const targets = new Set([".vue", ".ts", ".tsx", ".js", ".jsx"])

function isClosingParenLine(line) {
  return /^\s*\}\)\s*$/.test(line)
}

function isOnlyBraceLine(line) {
  return /^\s*\}\s*$/.test(line)
}

function isBlank(line) {
  return /^\s*$/.test(line)
}

function restore(content) {
  const lines = content.split(/\r?\n/)
  const out = []

  for (let i = 0; i < lines.length; i++) {
    const current = lines[i]
    if (isClosingParenLine(current)) {
      // 向前找最近非空行，判断是否缺少一个代码块右花括号
      let j = out.length - 1
      while (j >= 0 && isBlank(out[j])) j--
      const prev = j >= 0 ? out[j] : ""
      if (!isOnlyBraceLine(prev)) {
        const indent = current.match(/^(\s*)/)?.[1] ?? ""
        out.push(`${indent}}`)
      }
    }
    out.push(current)
  }

  return out.join("\n")
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(target)
      continue
    }
    const ext = path.extname(target)
    if (!targets.has(ext)) continue
    const oldContent = fs.readFileSync(target, "utf8")
    const newContent = restore(oldContent)
    if (newContent !== oldContent) {
      fs.writeFileSync(target, newContent)
    }
  }
}

walk(root)
