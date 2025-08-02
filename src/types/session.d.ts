/**
 * Represents a wellness session created by a user.
 * Each session can be in draft or published state and contains metadata such as title, tags,
 * a link to its structured content (JSON file), and timestamps for tracking creation and updates.
 * This model aligns with the session management requirements defined in the Arvyax assignment.
 */
export interface Session {
  _id: string
  title: string
  tags: string[]
  json_file_url: string
  user_id: {
    email: string
  }
  status: "draft" | "published"
  created_at: string
  updated_at: string
}
