export class ApiResponse {
  status!: number;
  response!: object;
  isSuccessful: boolean = false;

  constructor(response: object, status: number, isSuccessful: boolean = false) {
    this.response = response;
    this.status = status;
    this.isSuccessful = isSuccessful;
  }
}
