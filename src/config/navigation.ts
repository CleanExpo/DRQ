export interface NavigationItem {
  title: string;
  path: string;
  color: string;
  subItems?: string[];
}

export const navigationItems: NavigationItem[] = [
  {
    title: "Water Damage",
    path: "/services/water-damage",
    color: "#4285F4",
    subItems: [
      "Emergency Response",
      "Commercial Services",
      "Residential Services"
    ]
  },
  {
    title: "Fire Damage",
    path: "/services/fire-damage",
    color: "#DB4437",
    subItems: [
      "Emergency Response",
      "Smoke Damage",
      "Property Restoration"
    ]
  },
  {
    title: "Mould Remediation",
    path: "/services/mould-remediation",
    color: "#0F9D58",
    subItems: [
      "Mould Inspection",
      "Remediation Services",
      "Prevention"
    ]
  }
];
