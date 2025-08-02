/**
 * Converts an ISO date string into a human-readable format.
 * Example output: "Aug 1, 2025"
 */
export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }
  