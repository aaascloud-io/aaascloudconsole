import {Injectable} from "@angular/core";

declare var Snap: any;

@Injectable()
export class SvgService {

    constructor() {
    }

    public createSVG(icon, text, textX, textY, textSize, textColor): Promise<string> {
        return new Promise((resolve, reject) => {
            const snap = Snap().remove();
            Snap.load(icon, function (svg) {
                let tmp_svg = Object.assign({}, svg);
                let tmp = tmp_svg.node;
                if(!tmp_svg.viewBox){
                    let children = svg.node.children;
                    for(let idx = 0; idx < children.length; idx++){
                        if(children[idx].nodeName === "svg"){
                            tmp = children[idx];
                            break;
                        }
                    }
                }
                if(!tmp){
                    return resolve(icon);
                }

                // 基本情報設定
                let baseVal = tmp.viewBox.baseVal;
                let height = tmp.height.baseVal;
                let width = tmp.width.baseVal;
                snap.attr('viewBox', baseVal.x + " " + baseVal.y + " " + baseVal.width + " " + baseVal.height);
                snap.attr('height', height.value);
                snap.attr('width', width.value);
                snap.attr('xmlns', 'http://www.w3.org/2000/svg');
                snap.append(svg.selectAll('svg>*'));

                // 文字列追加
                let addText = snap.text(textX, textY, text);
                addText.attr({fill: textColor, fontSize: textSize});
                // SVGから文字列に変換する
                const svgStr = new XMLSerializer().serializeToString(snap.node);
                const blob = new Blob([svgStr], {
                    type: 'image/svg+xml'
                });
                const blobStr = URL.createObjectURL(blob);

                resolve(blobStr);
            });
        });
    }

    private xxx(svg){

        svg.node.children[0].nodeName
    }


    private test(icon): Promise<string> {
        return new Promise((resolve, reject) => {
            const snap = Snap().remove();
            Snap.load(icon, function (svg) {
                // var text = s.text(100, 100, 'MP SVG').attr({fill: 'red', fontFamily: 'Rock Salt', 'font-size': 100});
                // snap.attr('height', "65");
                // snap.attr('width', "65");
                // snap.attr('viewBox', "0 0 1024 1024");

                snap.attr('height', "32");
                snap.attr('width', "32");
                snap.attr('viewBox', "0 0 48 48");
                snap.attr('xmlns', 'http://www.w3.org/2000/svg');
                snap.append(svg.selectAll('svg>*'));
                let text = snap.text(20, 30, "ﾃ");
                text.attr({fill: 'red'});

                const svgStr = new XMLSerializer().serializeToString(snap.node);
                const blob = new Blob([svgStr], {
                    type: 'image/svg+xml'
                });
                const blobStr = URL.createObjectURL(blob);
                icon = blobStr;
                resolve(blobStr);
            });
        });
    }

//     const p1 = this.test(icon);
//     Promise.all([p1]).then(() => {
//
// });

}
