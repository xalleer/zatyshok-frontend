import type {Property} from "~/types/property";

export enum Role {
  HOST = 'HOST',
  CLIENT = 'CLIENT',
}

export interface User {
  id: string,
  createdAt: string,
  updatedAt: string,
  name: string | null,
  phone: string,
  role: Role
}

export interface VerifyOtpRequest {
  phone: string
  code: string
  role: Role
}

export interface VerifyOtpResponse {
  message: string
  user: User
  property?: Property
}

