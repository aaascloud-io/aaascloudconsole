package jp.co.ifocus.commons.model;

public abstract class TaskWithImei<T> implements Runnable{

	public String imei;
	public T processObj;

	public TaskWithImei(String imei, T processObj) {
		this.imei = imei;
		this.processObj = processObj;
	}
	
	protected abstract void work(T t);

	@Override
	public void run() {
		work(processObj);
	}
	

}