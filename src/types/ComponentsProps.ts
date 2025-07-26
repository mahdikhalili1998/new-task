import { ReactNode } from "react";

export interface LayoutProps {
  children: ReactNode;
}

export interface IProps {
  params: { id: string };
}

export interface ID {
  id: string;
}

export interface ICreateUser {
  setIsCreateUser: (value: boolean) => void;
}
 export type TProps = {
   src?: string;
   alt: string;
   userId: string | number;
 };