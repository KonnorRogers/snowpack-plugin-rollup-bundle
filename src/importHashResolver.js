const path = import("path")

export function importHashResolver({currentFilePath, fileName, manifestKeys}) {
  const oldFiles = manifestKeys.map((file) => path.relative(currentFilePath, file))
  return fileName.replace(
    /from\s*['"]\(.?.*\)['"]/g,
    (oldPath) => {
      if (!oldFiles.contains(oldPath)) {
        return oldPath // Do nothing
      }

      const substituteFile = path.relative(currentFilePath, newFile)
      return oldPath.replace(substituteFile);
    }
  );
}
