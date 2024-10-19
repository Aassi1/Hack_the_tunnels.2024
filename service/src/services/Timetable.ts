import { Timetable, ScheduledEvent } from "@prisma/client";
import { prisma } from "../db";
import { Result, Ok, Err } from "ts-results";
import { AccountService } from ".";

const checkOverlap = (
  event1: ScheduledEvent,
  event2: ScheduledEvent
): boolean => {
  if (event1.days !== event2.days) return false;
  const [start1, end1] = [event1.startTime, event1.endTime].map(
    (time) => new Date(`1970-01-01T${time}`)
  );
  const [start2, end2] = [event2.startTime, event2.endTime].map(
    (time) => new Date(`1970-01-01T${time}`)
  );
  return start1 < end2 && start2 < end1;
};

export const createTimetable = async (
  email: string,
  name: string,
  scheduledEventIds: string[]
): Promise<Result<Timetable, Error>> => {
  const account = await AccountService.findByEmail(email);

  if (account === null) {
    return Err(new Error("Account not found"));
  }

  const scheduledEvents = await prisma.scheduledEvent.findMany({
    where: {
      id: { in: scheduledEventIds.map((id) => parseInt(id)) },
    },
  });

  for (let i = 0; i < scheduledEvents.length; i++) {
    for (let j = i + 1; j < scheduledEvents.length; j++) {
      if (checkOverlap(scheduledEvents[i], scheduledEvents[j])) {
        return Err(
          new Error(
            `Course overlap detected between ${scheduledEvents[i].crn} and ${scheduledEvents[j].crn}`
          )
        );
      }
    }
  }

  const timetable = await prisma.timetable.create({
    data: {
      name,
      account: {
        connect: {
          id: account.id,
        },
      },
      timetableEvents: {
        create: scheduledEventIds.map((id) => ({
          scheduledEvent: {
            connect: {
              id: parseInt(id),
            },
          },
        })),
      },
    },
  });

  return Ok(timetable);
};
export const getTimetableById = async (
  id: number
): Promise<Result<Timetable, Error>> => {
  const timetable = await prisma.timetable.findUnique({
    where: {
      id,
    },
    include: {
      timetableEvents: {
        include: {
          scheduledEvent: {
            include: {
              course: true,
            },
          },
        },
      },
    },
  });

  if (timetable === null) {
    return Err(new Error("Timetable not found"));
  }

  return Ok(timetable);
};

export const getAccountTimetables = async (
  email: string
): Promise<Result<Timetable[], Error>> => {
  const account = await AccountService.findByEmail(email);

  if (account === null) {
    return Err(new Error("Account not found"));
  }

  const timetables = await prisma.timetable.findMany({
    where: {
      accountId: account.id,
    },
    include: {
      timetableEvents: {
        include: {
          scheduledEvent: {
            include: {
              course: true,
            },
          },
        },
      },
    },
  });

  return Ok(timetables);
};
