/**
 * Хранилище File-объектов вне Redux.
 * Redux требует сериализуемое состояние, File — не сериализуем.
 */

const files = new Map<string, File>();

let idCounter = 0;

export function addFile(file: File): string {
  const id = `att-${idCounter++}-${Date.now()}`;
  files.set(id, file);
  return id;
}

export function removeFile(id: string): void {
  files.delete(id);
}

export function getFile(id: string): File | undefined {
  return files.get(id);
}

export function clearFiles(): void {
  files.clear();
}
