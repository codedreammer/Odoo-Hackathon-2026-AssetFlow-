export interface Employee {
  id: number;
  name: string;
  email: string;
  avatar?: string;

  role: string;

  department: string;

  assets: number;

  assetValue: number;

  joined: string;

  status: "Active" | "On Leave" | "Inactive";
}

export interface Department {
  id: number;

  name: string;

  employees: number;

  assets: number;

  assetValue: number;

  color: string;
}

export interface StatCard {
  title: string;

  value: string;

  description: string;
}