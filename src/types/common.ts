import React from "react";

export type UUID = string;

export type Route = {
  href: string;
  label: string;
  icon: React.ReactNode;
  childrens?: Route[];
};

export type User = {
  role_id: string;
  name: string;
  email: string;
  role: string;
  role_name: string;
};

export type ErroField = { [key: string]: string };
