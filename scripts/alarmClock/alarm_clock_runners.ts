import { ethereum } from "@graphprotocol/graph-ts";
import { Log } from "../generated/schema";

export function runMinutely(event: ethereum.Event): void {
  const type = "minute";

  const log = new Log(type + "-" + event.block.timestamp.toString());
  log.timestamp = event.block.timestamp;
  log.type = type;
  log.save();
}

export function runHourly(event: ethereum.Event): void {
  const type = "hour";

  const log = new Log(type + "-" + event.block.timestamp.toString());
  log.timestamp = event.block.timestamp;
  log.type = type;
  log.save();
}

export function runDaily(event: ethereum.Event): void {
  const type = "day";
  const log = new Log(type + "-" + event.block.timestamp.toString());
  log.timestamp = event.block.timestamp;
  log.type = type;
  log.save();
}

export function runWeekly(event: ethereum.Event): void {
  const type = "week";
  const log = new Log(type + "-" + event.block.timestamp.toString());
  log.timestamp = event.block.timestamp;
  log.type = type;
  log.save();
}

export function runMonthly(event: ethereum.Event): void {
  const type = "month";
  const log = new Log(type + "-" + event.block.timestamp.toString());
  log.timestamp = event.block.timestamp;
  log.type = type;
  log.save();
}

export function runYearly(event: ethereum.Event): void {
  const type = "year";
  const log = new Log(type + "-" + event.block.timestamp.toString());
  log.timestamp = event.block.timestamp;
  log.type = type;
  log.save();
}
