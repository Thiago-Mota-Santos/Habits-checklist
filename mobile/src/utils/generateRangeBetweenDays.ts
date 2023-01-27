import dayjs from 'dayjs';

export function generateRangeBetweenDays (){
    const firstDayOfTheYear = dayjs().startOf('year');
    const today = new Date();

    const dates = []
    let compareData = firstDayOfTheYear


    while(compareData.isBefore(today)){
        dates.push(compareData.toDate())
        compareData = compareData.add(1, 'day')
    }

    return dates;
}