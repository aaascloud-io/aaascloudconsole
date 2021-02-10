export class coordinate{
    device_id:string;
    device_name:string;
    coordinate:latlng[];
    imei:string;
    battery:string;
    batterypercent:number;
}

export class latlng{
    lat:number;
    lng:number;
    date:string;
}