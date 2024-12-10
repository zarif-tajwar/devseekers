import { Response } from "express";

export interface OAuthCallbackResponse extends Response {
  origin?: string;
  redirectUrl?: string;
}
