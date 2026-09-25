/** Keeps the old Jekyll URLs: "2025-11-02-my-post" -> "2025/11/02/my-post". */
export function postSlug(id: string): string {
  return id.replace(/^(\d{4})-(\d{2})-(\d{2})-/, '$1/$2/$3/');
}

export const postHref = (id: string) => `/blog/${postSlug(id)}/`;
