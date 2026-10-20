type Ref = string | { id: string };

interface PropertyEntry {
  id: string;
  data: { neighborhood: Ref; order?: number };
}

/** The properties of one neighborhood, in the order set in their YAML. */
export function propertiesIn<T extends PropertyEntry>(properties: T[], neighborhood: string): T[] {
  return properties
    .filter(
      (p) =>
        (typeof p.data.neighborhood === 'string' ? p.data.neighborhood : p.data.neighborhood.id) ===
        neighborhood,
    )
    .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));
}
