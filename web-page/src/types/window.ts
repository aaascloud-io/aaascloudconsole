///あるVer.からwindowという変数が重複でエラー表示となった。ムカ―
interface MyWindow extends Window {
}
declare var window: MyWindow;
export default window;
