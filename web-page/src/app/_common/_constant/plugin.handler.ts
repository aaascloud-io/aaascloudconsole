
export class PluginHandler{
    static CALENDAR_OPTION ={
        jp: {
            firstDayOfWeek: 0,
            dayNames: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"],
            dayNamesShort: ["日", "月", "火", "水", "木", "金", "土"],
            dayNamesMin: ["日", "月", "火", "水", "木", "金", "土"],
            monthNames: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
            monthNamesShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
            today: '今日',
            clear: 'クリア'
        },
        placeholder: '日付を選択',
        calendarMessage: null,
        errorCode: {
            lastTimeisNull: '何日まで選択してください',
            timeisNull: '日付を選択してください'
        }
    }

    
    static ARRAYLIST_PAGINATOR = {
        ObsHistory: {
            rows: 20
        }
    }

    static WEATHER_API_APPID:string = 'bcfdf8c8eb2f693fa09d535f7273c202';
    static WEATHER_API_URL:string = 'https://api.openweathermap.org/data/2.5/forecast?id=1850147&APPID=bcfdf8c8eb2f693fa09d535f7273c202';
    static DATE_WEEK_JP:any = {
        0:'日',
        1:'月',
        2:'火',
        3:'水',
        4:'木',
        5:'金',
        6:'土'
    }

    static ECHARTS_SENSOR_VALUE = {

       
        TE:{        //長期用
            min:-20,
            max:50
        },
        HU:{        //長期用
            min:0,
            max:100
        },
        ST:{
            min:-20,
            max:50
        },
        SW:{
            min:0,
            max:100
        },
        IL:{
            min:0,
            max:120000
        },
        DIL:{
            min:0,
            max:200000000
        },
        TIL:{
            min:0,
            max:5000000
        },
        CD:{
            min:0,
            max:3000
        },
        WS:{
            min:0,
            max:30
        },
        IWS:{
            min:0,
            max:30 
        },
        WD:{
            min:0,
            max:360
        },
        PH:{
            min:0,
            max:15
        },
        UV:{
            min:0,
            max:6000
        },
        HRA:{
            min:0,
            max:200
        },
        DRA:{
            min:0,
            max:200
        },
        HD:{
            min:0,
            max:40
        },
        SS:{
            min:0,
            max:50
        },
        RR:{
            min:0,
            max:0.2
        },
        VO:{
            min:0,
            max:22
        },


        ITE:{
            min:-20,
            max:50
        },
        OTE:{
            min:-20,
            max:50
        }, 
        IHU:{
            min:0,
            max:100
        },
        OHU:{
            min:0,
            max:100
        }, 
        IST:{
            min:-20,
            max:50
        },
        ISW:{
            min:0,
            max:100
        },
        OIL:{
            min:0,
            max:120000
        },
        ODIL:{
            min:0,
            max:200000000
        },
        OTIL:{
            min:0,
            max:5000000
        },
        ICD:{
            min:0,
            max:3000
        },
        OWS:{
            min:0,
            max:30
        },
        OIWS:{
            min:0,
            max:30 
        },
        OWD:{
            min:0,
            max:360
        },
        IPH:{
            min:0,
            max:15
        },
        OUV:{
            min:0,
            max:6000
        },
        OHRA:{
            min:0,
            max:200
        },
        ODRA:{
            min:0,
            max:200
        },
        ISS:{
            min:0,
            max:50
        },
        ORR:{
            min:0,
            max:0.2
        },
        IVO:{
            min:0,
            max:22
        }

    }

    static PAGE_DEIVE_GROUP_AVE = {
        ITE:{
            name:'室内温度',
            unit:'°C',
            id:'AI1000AVE'
        },
        IHU:{
            name:'室内湿度',
            unit:'%',
            id:'AI2000AVE'
        },
        HD:{
            name:'飽差',
            unit: 'g/cm3',
            id:'AI3000AVE'
        },
        WOW:{
            name:'窓',
            id:'DI1000AVE'
        },
        MIT:{
            name:'ミスト',
            id:'DI2000AVE'
        },
        SHA:{
            name:'遮光',
            id:'DI3000AVE'
        }
    }
    
    static COLLECTWEATHER = {
        color:['bg-primary','bg-teal','bg-brown','bg-dark-cyan','bg-purple','bg-dark-deep-orange'],
        defultName:{
            OTE:'ハウス外温度',
            OHU:'ハウス外湿度',
            HD:'ハウス外飽差',
            WS:'ハウス外風速',
            HRA:'ハウス外時間雨量',
            IL:'ハウス外照度'
        }
    }

    static LONGTERM_SENSOR_TYPE = {
        detail:['ITE','OTE','IHU','OHU','DIL','DRA','ODIL','ODRA'],
        // {
        //     '10000101':['ITE','OTE','IHU','OHU','DIL','DRA'],
        //     'TOMATO-1':['ITE','IHU'],
        // },
        extension_sensor_type:['ITE','OTE','IHU','OHU'],//多重図用のセンサー
        extension:['_MAX', '_MIN', '_AVE', '_DIF'],//多重図用の種類
        Integration:['ITE','OTE','DIL','DRA','ODIL','ODRA'],//積算グラフ
        longterm_Yaxis_line:['_MAX', '_MIN', '_AVE'],//line線
        integration_series_types:['DIL','DRA','ODIL','ODRA'],
        integration_grap:['ITE','OTE','DIL','DRA','ODIL','ODRA']
    } 

    static alertInterval = 20*60*1000;

}