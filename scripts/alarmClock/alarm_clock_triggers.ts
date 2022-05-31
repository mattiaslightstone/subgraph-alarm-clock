import { NewRound } from "../generated/HourlyEvents/AccessControlledOffchainAggregator";
import { LastRun } from "../generated/schema";
import { BigInt } from "@graphprotocol/graph-ts";
import {
  runDaily,
  runHourly,
  runMinutely,
  runMonthly,
  runWeekly,
  runYearly,
} from "./alarm_clock_runners";

const MINUTE_ID = "minute";
const HOUR_ID = "hour";
const WEEK_ID = "week";
const MONTH_ID = "month";
const YEAR_ID = "year";

export function handleCronTrigger(event: NewRound): void {
  let currentTimestamp = event.block.timestamp;
  let currentBlock = event.block.number;

  const date = new Date((currentTimestamp.toI64() * 1000) as i64);

  // check by minute
  const minutelyResult = testMinute(date);
  if (minutelyResult) {
    runMinutely(event);
    updateLastRun(MINUTE_ID, currentTimestamp, currentBlock);
  }
  // check hourly
  const hourlyResult = testHour(date);
  if (hourlyResult) {
    runHourly(event);
    updateLastRun(HOUR_ID, currentTimestamp, currentBlock);
  }
  // check daily
  const dailyResult = testDay(date);
  if (dailyResult) {
    runDaily(event);
    updateLastRun("day", currentTimestamp, currentBlock);
  }
  // // check weekly
  const weeklyResult = testWeek(date);
  if (weeklyResult) {
    runWeekly(event);
    updateLastRun(WEEK_ID, currentTimestamp, currentBlock);
  }
  // // check monthly
  const monthlyResult = testMonth(date);
  if (monthlyResult) {
    runMonthly(event);
    updateLastRun(MONTH_ID, currentTimestamp, currentBlock);
  }
  // // check yearly
  const yearlyResult = testYear(date);
  if (yearlyResult) {
    runYearly(event);
    updateLastRun(YEAR_ID, currentTimestamp, currentBlock);
  }
}

function updateLastRun(id: string, timestamp: BigInt, block: BigInt): void {
  const lastRun = ensureLastRun(id);

  lastRun.timestamp = timestamp;
  lastRun.block = block;
  lastRun.save();
}

function testMinute(currentDate: Date): boolean {
  // runs at x:00:00 every minute
  const lastRun = ensureLastRun(MINUTE_ID);
  // get the last hour time
  currentDate.setUTCMilliseconds(0 as i32);
  currentDate.setUTCSeconds(0 as i32);
  return currentDate.getTime() / 1000 >= lastRun.timestamp.toI64();
}

function testHour(currentDate: Date): boolean {
  // runs at x:00 every hour
  const lastRun = ensureLastRun(HOUR_ID);
  // get the last hour time
  currentDate.setUTCMilliseconds(0 as i32);
  currentDate.setUTCSeconds(0 as i32);
  currentDate.setUTCMinutes(0 as i32);
  return currentDate.getTime() / 1000 >= lastRun.timestamp.toI64();
}

function testDay(currentDate: Date): boolean {
  // runs at 0:00 every day
  const lastRun = ensureLastRun("day");
  // get the last day time
  currentDate.setUTCMilliseconds(0 as i32);
  currentDate.setUTCSeconds(0 as i32);
  currentDate.setUTCMinutes(0 as i32);
  currentDate.setUTCHours(0 as i32);
  return currentDate.getTime() / 1000 >= lastRun.timestamp.toI64();
}

function testWeek(currentDate: Date): boolean {
  // runs on sunday every week
  const lastRun = ensureLastRun(WEEK_ID);
  // get the last week time
  currentDate.setUTCMilliseconds(0 as i32);
  currentDate.setUTCSeconds(0 as i32);
  currentDate.setUTCMinutes(0 as i32);
  currentDate.setUTCHours(0 as i32);
  const temp = currentDate.getTime();
  const dayOfWeek = currentDate.getUTCDay();

  const weekDate = temp - 86_400_000 * dayOfWeek;

  return weekDate / 1000 >= lastRun.timestamp.toI64();
}

function testMonth(currentDate: Date): boolean {
  // runs on sunday every week
  const lastRun = ensureLastRun(MONTH_ID);
  // get the last week time
  currentDate.setUTCMilliseconds(0 as i32);
  currentDate.setUTCSeconds(0 as i32);
  currentDate.setUTCMinutes(0 as i32);
  currentDate.setUTCHours(0 as i32);
  currentDate.setUTCDate(1 as i32);

  return currentDate.getTime() / 1000 >= lastRun.timestamp.toI64();
}

function testYear(currentDate: Date): boolean {
  const lastRun = ensureLastRun(YEAR_ID);

  currentDate.setUTCMilliseconds(0 as i32);
  currentDate.setUTCSeconds(0 as i32);
  currentDate.setUTCMinutes(0 as i32);
  currentDate.setUTCHours(0 as i32);
  currentDate.setUTCDate(1 as i32);
  currentDate.setUTCMonth(0 as i32);

  return currentDate.getTime() / 1000 >= lastRun.timestamp.toI64();
}

function ensureLastRun(id: string): LastRun {
  let lastRun = LastRun.load(id);
  if (!lastRun) {
    lastRun = new LastRun(id);
    lastRun.timestamp = new BigInt(0);
    lastRun.block = new BigInt(0);
    lastRun.save();
  }
  return lastRun;
}
