import { Injectable } from "@angular/core";
import * as moment from "moment";

@Injectable({ providedIn: 'root' })
export class DataService {    
    getFirstBusinessDayOfNextMonth(date: Date): Date {
        const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        let day = nextMonth.getDay();
        if (day === 0) { // Sunday
          nextMonth.setDate(2);
        } else if (day === 6) { // Saturday
          nextMonth.setDate(3);
        }
        return nextMonth;
    }

    getCommissionRange(currentDate: Date): { startDate: Date, endDate: Date } {
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endDate = this.getFirstBusinessDayOfNextMonth(currentDate);
        return { startDate, endDate };
    }
}