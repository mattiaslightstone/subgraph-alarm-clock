import { NewRound } from "../generated/HourlyEvents/AccessControlledOffchainAggregator";
import { Cron, CronList } from "../generated/schema";
import { log } from "@graphprotocol/graph-ts";

export function handleCronTrigger(event: NewRound): void {
  // Load all of the existing cron Ids
}

export function ensureCronList(): CronList {
  let cronList = CronList.load("default");

  if (!cronList) {
    cronList = new CronList("default");
    cronList.save();
  }

  return cronList;
}

export function addToCronList(id: string): void {
  const cronList = ensureCronList();

  const tempList = cronList.cronIds;
  tempList.push(id);
  cronList.cronIds = tempList;
  cronList.save();
}

export function createCron(
  id: string,
  minute: i8,
  hour: i8,
  monthDay: i8,
  month: i8,
  weekDay: i8
): void {
  let cron = new Cron(id);
  cron.minute = minute;
  cron.hour = hour;
  cron.monthDay = monthDay;
  cron.month = month;
  cron.weekDay = weekDay;

  if (monthDay != -1 && weekDay != -1) {
    log.critical(
      "Cron job can't have both week day and month day set, this feature is not yet supported",
      []
    );
  }

  cron.save();

  addToCronList(cron.id);
}

export function getCron(id: string): Cron | undefined {
  let cron = Cron.load(id);
  if (!cron) {
    log.error("Chould not load cron job: {}", [id]);
    return undefined;
  } else {
    return cron;
  }
}

export function cronCheck(id: string): boolean {
  // FIXME This algorithm does not work
  // get the cron
  const cron = getCron(id);
  if (!cron) {
    return false;
  }

  // grab the last timestamp that the cron did run
  const lastRun = cron.lastRun;

  // separate into it's component parts
  const currentDate = new Date();

  const currentMinute = currentDate.getUTCMinutes();
  const currentHour = currentDate.getUTCHours();
  const currentMonthDay = currentDate.getUTCDate();
  const currentMonth = currentDate.getUTCMonth();
  const currentWeekDay = currentDate.getUTCDay();

  let searchDate = currentDate;

  // Set the values that are specific in the "cron"
  if (currentMonth != -1) {
    searchDate.setUTCMonth(cron.month);
  }
  if (currentMonthDay != -1) {
    searchDate.setUTCDate(cron.monthDay);
  } else {
    const offset = cron.weekDay - currentWeekDay;
    searchDate.setUTCDate(currentMonthDay + offset);
  }
  if (currentHour != -1) {
    searchDate.setUTCHours(cron.hour);
  }
  if (currentMinute != -1) {
    searchDate.setUTCMinutes(cron.minute);
  }

  if (
    lastRun <= searchDate.valueOf() &&
    searchDate.valueOf() <= currentDate.valueOf()
  ) {
    return true;
  }

  // Next try to bump the -ve values to the current values
  if (currentMonth == -1) {
    searchDate.setUTCMonth(currentMonth);
  }
  if (currentMonthDay == -1) {
    searchDate.setUTCDate(currentMonthDay);
  }
  if (currentHour == -1) {
    searchDate.setUTCHours(currentHour);
  }
  if (currentMinute == -1) {
    searchDate.setUTCMinutes(currentMinute);
  }

  // check if it is less than current date, and greater than previous date
  if (
    lastRun <= searchDate.valueOf() &&
    searchDate.valueOf() <= currentDate.valueOf()
  ) {
    return true;
  }
  return false;

  // Then compare that timestamp to the last run timestamp
}
