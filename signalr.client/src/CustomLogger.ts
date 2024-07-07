import { ILogger, LogLevel } from "@microsoft/signalr";

export class CustomLogger implements ILogger {
  log(logLevel, message) {
    console.log(`${logLevel} :: ${message}`);
  }
}
