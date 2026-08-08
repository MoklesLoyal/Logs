import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pagesRoot = path.resolve(__dirname, '../../pages')
const publicDir = path.resolve(__dirname, '../public')
const targetDir = path.join(publicDir, 'pages')

async function sync() {
  await fs.mkdir(targetDir, { recursive: true })

  const entries = await fs.readdir(pagesRoot, { withFileTypes: true })
  const htmlFiles = entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.html'))
    .map((e) => e.name)
    .sort()

  // Copy HTML files into the public folder so they are served as static assets.
  // Existing files are overwritten to keep the viewer in sync.
  for (const file of htmlFiles) {
    const src = path.join(pagesRoot, file)
    const dest = path.join(targetDir, file)
    await fs.copyFile(src, dest)
  }

  // Clean up files that no longer exist in the source folder.
  const existingTargets = await fs.readdir(targetDir)
  for (const file of existingTargets) {
    if (!htmlFiles.includes(file) && file !== 'manifest.json') {
      await fs.unlink(path.join(targetDir, file))
    }
  }

  const manifest = { files: htmlFiles, generatedAt: new Date().toISOString() }
  await fs.writeFile(
    path.join(targetDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  )

  console.log(`Synced ${htmlFiles.length} log file(s) to public/pages.`)
}

sync().catch((err) => {
  console.error('Failed to sync pages:', err)
  process.exit(1)
})
