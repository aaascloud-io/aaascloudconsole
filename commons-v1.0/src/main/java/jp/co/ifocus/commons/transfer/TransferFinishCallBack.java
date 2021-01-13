package jp.co.ifocus.commons.transfer;

public interface TransferFinishCallBack{

	public void onSuccess(Object returnObj);
	
	public void onError(Object returnObj);
	
	public void onTimeout(Object returnObj);
	
}
