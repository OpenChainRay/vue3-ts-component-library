const fs = require("fs")
const path = require("path")

const historyRoot = "C:/Users/94314/AppData/Roaming/Cursor/User/History"
const projectRoot = "D:/XMJH/vue3-ts-component-library"
const examplesRoot = "D:/XMJH/vue3-ts-component-library/examples/"
const cutoff = new Date("2026-05-15T09:00:00+08:00").getTime()

function decodeFileUri(uri) {
  if (!uri || !uri.startsWith("file:///")) return ""
  let p = decodeURIComponent(uri.replace("file:///", ""))
  if (/^[A-Za-z]:/.test(p)) return p
  if (/^\/[A-Za-z]:/.test(p)) return p.slice(1)
  return p
}

function normalizeWin(p) {
  return p.replace(/\\/g, "/").toLowerCase()
}

function collectEntriesJson(dir, acc) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      collectEntriesJson(target, acc)
    } else if (entry.name === "entries.json") {
      acc.push(target)
    }
  }
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

const entriesFiles = []
collectEntriesJson(historyRoot, entriesFiles)

let restored = 0
let skippedNoBeforeCutoff = 0
let skippedNoSnapshot = 0
const touched = new Set()

for (const entriesFile of entriesFiles) {
  let parsed
  try {
    parsed = JSON.parse(fs.readFileSync(entriesFile, "utf8"))
  } catch {
    continue
  }
  const absPath = decodeFileUri(parsed.resource || "")
  if (!absPath) continue
  const normAbs = normalizeWin(absPath)
  if (!normAbs.startsWith(normalizeWin(examplesRoot))) continue

  const list = Array.isArray(parsed.entries) ? parsed.entries : []
  if (!list.length) continue

  let candidate = list
    .filter((e) => typeof e.timestamp === "number" && e.timestamp <= cutoff)
    .sort((a, b) => b.timestamp - a.timestamp)[0]

  if (!candidate) {
    skippedNoBeforeCutoff += 1
    continue
  }

  const snapPath = path.join(path.dirname(entriesFile), candidate.id)
  if (!fs.existsSync(snapPath)) {
    skippedNoSnapshot += 1
    continue
  }

  const buffer = fs.readFileSync(snapPath)
  ensureDir(absPath)
  fs.writeFileSync(absPath, buffer)
  restored += 1
  touched.add(absPath)
}

console.log(
  JSON.stringify(
    {
      restored,
      skippedNoBeforeCutoff,
      skippedNoSnapshot,
      uniqueFiles: touched.size
    },
    null,
    2
  )
)
