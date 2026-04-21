import React from "react";

export type UUID = string;

export type Route = {
  href: string;
  label: string;
  icon: React.ReactNode;
  childrens?: Route[];
};

export type User = {
  id: string
  name: string
  email: string
  role_name: string
  created_at: string
  updated_at: string
}

export type Role = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type Teacher = {
  id: string;
  paud_id: string;
  user_id: string;
  phone: string;
  name: string;
  email: string;
  role_name?: string;
  created_at: string;
  updated_at: string;
};

export type Parent = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export type Class = {
  id: string;
  teacher_id: string;
  teacher_name?: string;
  paud_id: string;
  name: string;
  level: string;
  academic_year: string;
  created_at: string;
  updated_at: string;
}

export type Student = {
  id: string;
  paud_id: string;
  parent_id: string;
  class_id: string;
  name: string;
  gender: string;
  birth_date: string;
  photo?: string | null;
  nisn: string;
  created_at: string;
  updated_at: string;
}

export type CurrentPaud = {
  id: string
  name: string
  subdomain: string
  status?: string
}
export type ErroField = { [key: string]: string };
