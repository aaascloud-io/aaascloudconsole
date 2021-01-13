package jp.co.ifocus.commons.transfer;

/**
 * データ転送実行IF
 * @author tang.misi
 *
 */
public interface DataTransferer {
	
	/**
	 * 実行
	 */
	public void execute(Object object, TransferFinishCallBack callBack);
	

}
