import { STATUS_CODE } from "../utils/status-code";

export class ApiError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = STATUS_CODE.BAD_REQUEST) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError"; // Define o nome do erro
  }
}
