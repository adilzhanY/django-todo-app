export function translateStatus(status: string): string {
  switch (status) {
    case "open":
      return "Offen";
    case "in_progress":
      return "In Bearbeitung";
    case "done":
      return "Erledigt";
    default:
      return "Unbekannt";
  }
}


