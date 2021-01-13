package jp.co.ifocus.commons.transfer;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jp.co.ifocus.commons.log.MessageIdConstants;

public class DataTransferHandler {
	
	private Logger LOG = LoggerFactory.getLogger(getClass());
	
	public static DataTransferHandler INSTANCE = new DataTransferHandler();
	private DataTransferHandler() {}
	
	private List<DataTransferer> registeredTransferers = new ArrayList<DataTransferer>();
	
	public void register(DataTransferer transferer) {
		registeredTransferers.add(transferer);
	}
	
	public void doHandle(Object object) {
		for (DataTransferer dataTransferer : registeredTransferers) {
			try {
				dataTransferer.execute(object, new TransferFinishCallBack() {
					
					@Override
					public void onTimeout(Object returnObj) {
						LOG.error(MessageIdConstants.E08089, dataTransferer.getClass().toGenericString(), returnObj);
					}
					
					@Override
					public void onSuccess(Object returnObj) {
						LOG.debug("DataTransferer: {} execution success. Return: {}", dataTransferer.getClass().toGenericString(), returnObj);
					}
					
					@Override
					public void onError(Object returnObj) {
						LOG.error(MessageIdConstants.E08090, dataTransferer.getClass().toGenericString(), returnObj);
					}
				});
			} catch (Exception e) {
				LOG.error(MessageIdConstants.E08045, dataTransferer.getClass(), object, e);
			}
		}
	}
}
